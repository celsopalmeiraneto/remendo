import React, {Component} from 'react';

import {AppContext} from '../../app-context.js';
import {ShopInfoCard} from '../ShopInfoCard/';
import {TireRepairShop} from '../../model/TireRepairShop.js';

import styles from './index.module.css';
import flatTire from '../../assets/flat-tire.svg';
import wrench from '../../assets/wrench.ico';

const BRAZILS_CENTROID = {
  lat: -11.2241431,
  lng: -52.582926,
};

export class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coordsCount: 0,
      isMapReady: false,
      shops: {},
    };

    this.changeCounter = 0;
    this.mapRef = React.createRef();
  }

  animateShop(shopId) {
    const shop = this.state.shops[shopId];
    if (!shop) return;

    const marker = shop.marker;
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    setTimeout(() => {
      marker.setAnimation(null);
    }, 500);
  }

  closeShopInfoCard() {
    this.context.setHighlightedShop(null);
  }

  async componentDidMount() {
    const map = await this.setupMap({coords: BRAZILS_CENTROID});
    const coords = await this.getUserPosition();
    this.drawUserPositionOnMap({coords, map});
    map.panTo(coords);
    await this.onChangeBoundaries({map});
    this.context.setCentroidTo = this.setCentroidTo.bind(this, map);
    this.context.animateShop = this.animateShop.bind(this);
  }

  degreesBetweenLatitudes(south, north) {
    if ((south === 0 || north === 0)
    || (south > 0 && north > 0 )
    || (south < 0 && north < 0)) {
      return Math.abs(south - north);
    }
    return Math.abs(south) + Math.abs(north);
  }
  degreesBetweenLongitudes(east, west) {
    const differenceFromZero = this.degreesBetweenLatitudes(east, west);
    const differenceFrom180 = Math.abs(-180 - east) + Math.abs(180 - west);
    return Math.min(differenceFromZero, differenceFrom180);
  }

  divideMapInQuadrants(map) {
    const center = map.getCenter();
    const bounds = map.getBounds();

    return new Array(4).fill(null).map((it, idx) => {
      const sw = {
        lat: null,
        lng: null,
      };
      const ne = {
        lat: null,
        lng: null,
      };

      switch (idx) {
        case 0:
          sw.lat = center.lat();
          sw.lng = center.lng();
          ne.lat = bounds.getNorthEast().lat();
          ne.lng = bounds.getNorthEast().lng();
          break;
        case 1:
          sw.lat = bounds.getSouthWest().lat();
          sw.lng = center.lng();
          ne.lat = center.lat();
          ne.lng = bounds.getNorthEast().lng();
          break;
        case 2:
          sw.lat = bounds.getSouthWest().lat();
          sw.lng = bounds.getSouthWest().lng();
          ne.lat = center.lat();
          ne.lng = center.lng();
          break;
        case 3:
          sw.lat = center.lat();
          sw.lng = bounds.getSouthWest().lng();
          ne.lat = bounds.getNorthEast().lat();
          ne.lng = center.lng();
          break;
        default:
          return null;
      }

      return {ne, sw};
    });
  }

  drawMap({coords}) {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        try {
          const map = new window.google.maps.Map(this.mapRef.current, {
            center: coords,
            clickableIcons: false,
            fullscreenControl: false,
            zoom: 17,
            zoomControl: false,
          });
          window.google.maps.event.addListenerOnce(map,
              'idle',
              () => {
                window.google.maps.event.addListener(map,
                    'bounds_changed',
                    this.onChangeBoundaries.bind(this, {map}),
                );
                return resolve(map);
              },
          );
        } catch (e) {
          return reject(e);
        }
      } else {
        return resolve(false);
      }
    });
  }

  drawTireRepairShops({map, shops}) {
    shops.forEach((shop) => {
      if (shop.id in this.state.shops) {
        const marker = this.state.shops[shop.id].marker;
        marker.setMap(map);
        return;
      }
      const marker = new window.google.maps.Marker({
        icon: {
          scaledSize: new window.google.maps.Size(
              2,
              2,
              'rem',
              'rem',
          ),
          url: wrench,
        },
        map,
        position: shop.coords,
        visible: true,
      });
      shop.marker = marker;
      const item = {};
      item[shop.id] = shop;
      this.setState({
        shops: Object.assign({}, this.state.shops, item),
      });
      window.google.maps.event.addListener(marker,
          'click',
          () => {
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => {
              marker.setAnimation(null);
            }, 500);
            this.context.setHighlightedShop(shop);
          },
      );
    });
  }

  drawUserPositionOnMap({coords, map}) {
    new window.google.maps.Marker({
      map,
      position: coords,
      visible: true,
    });
  }

  async getUserPosition() {
    if (!('geolocation' in navigator)) return BRAZILS_CENTROID;

    try {
      const position = await (new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
          return resolve(position);
        }, (err) => {
          return reject(err);
        });
      }));

      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    } catch (e) {
      console.error(e);
      return BRAZILS_CENTROID;
    }
  }

  async onChangeBoundaries({map}) {
    this.changeCounter++;
    setTimeout(async () => {
      this.changeCounter--;

      if (this.changeCounter !== 0) return;

      let bounds = map.getBounds();
      bounds = {
        ne: bounds.getNorthEast().toJSON(),
        sw: bounds.getSouthWest().toJSON(),
      };

      const zoom = map.getZoom();
      if (zoom >= 13) {
        this.context.setZoom(zoom);
        this.context.setBoundaries(bounds);
        const shops = await TireRepairShop.findByCoords(bounds);
        return this.drawTireRepairShops({map, shops});
      } else {
        this.context.setZoom(null);
        this.context.setBoundaries(null);
        this.removeMarkersFromMap();
      }
    }, 700);
  }

  setupMap({coords}) {
    return new Promise(async (resolve, reject) => {
      const map = await this.drawMap({coords});
      if (!map) {
        const interval = window.setTimeout(async () => {
          const map = await this.drawMap({coords});
          if (map) {
            window.clearInterval(interval);
            this.setState({
              isMapReady: true,
            });
            return resolve(map);
          }
        }, 1000);
      } else {
        this.setState({
          isMapReady: true,
        });
        return resolve(map);
      }
    });
  }

  async summarizeShops({map}) {
    const quadrants = this.divideMapInQuadrants(map);
    await Promise.all(quadrants.map(async (quadrant, idx) => {
      await TireRepairShop.findByCoords({
        ...quadrant,
        includeDocs: false,
      });
    }));
  }

  removeMarkersFromMap() {
    for (const id in this.state.shops) {
      if (this.state.shops.hasOwnProperty(id)) {
        const marker = this.state.shops[id].marker;
        marker.setMap(null);
      }
    }
  }

  render() {
    return (
      <div className={styles.mapContainer}>
        {this.context.highlightedShop && (
          <div className={styles.infoPoi}>
            <ShopInfoCard
              shop={this.context.highlightedShop}
              onClose={this.closeShopInfoCard.bind(this)}
            />
          </div>
        )}
        <div className={styles.map} ref={this.mapRef}>
        </div>
      </div>
    );
  }

  setCentroidTo(map, coords) {
    map.panTo(coords);
  }
}

Map.contextType = AppContext;
