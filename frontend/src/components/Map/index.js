import React, {Component} from 'react';

import {ShopInfoCard} from '../ShopInfoCard/';
import {TireRepairShop} from '../../model/TireRepairShop.js';

import './index.css';
import flatTire from '../../assets/flat-tire.svg';
import wrench from '../../assets/wrench.ico';

export class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coordsCount: 0,
      isMapReady: false,
      markers: {},
      selectedShop: null,
    };

    this.mapRef = React.createRef();
  }

  closeShopInfoCard() {
    this.setState({
      selectedShop: null,
    });
  }

  async componentDidMount() {
    const coords = await this.getUserPosition();
    const map = await this.setupMap({coords});
    this.drawUserPositionOnMap({coords, map});
    await this.onChangeBoundaries({map});
  }

  async onChangeBoundaries({map}) {
    const bounds = map.getBounds();
    const shops = await TireRepairShop.findByCoords({
      ne: bounds.getNorthEast().toJSON(),
      sw: bounds.getSouthWest().toJSON(),
    });
    this.drawTireRepairShops({map, shops});
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
      if (shop.id in this.state.markers) return;
      const marker = new window.google.maps.Marker({
        icon: {
          scaledSize: new window.google.maps.Size(
              1.5,
              1.5,
              'rem',
              'rem',
          ),
          url: wrench,
        },
        map,
        position: shop.coords,
        visible: true,
      });
      const item = {};
      item[shop.id] = shop;
      this.setState({
        markers: Object.assign({}, this.state.markers, item),
      });
      window.google.maps.event.addListener(marker,
          'click',
          () => {
            this.setState({
              selectedShop: shop,
            });
          },
      );
    });
  }

  drawUserPositionOnMap({coords, map}) {
    new window.google.maps.Marker({
      icon: {
        scaledSize: new window.google.maps.Size(
            1.5,
            1.5,
            'rem',
            'rem',
        ),
        url: flatTire,
      },
      map,
      position: coords,
      visible: true,
    });
  }

  async getUserPosition() {
    const centroidOfBrazil = {
      lat: -11.2241431,
      lng: -52.582926,
    };
    if (!('geolocation' in navigator)) return centroidOfBrazil;

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
      return centroidOfBrazil;
    }
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

  render() {
    return (
      <div className="map-container">
        <div className="map" ref={this.mapRef}>
        </div>
        <div className="info-poi">
          {this.state.selectedShop && (
            <ShopInfoCard
              shop={this.state.selectedShop}
              onClose={this.closeShopInfoCard.bind(this)}
            />
          )}
        </div>
      </div>
    );
  }
}
