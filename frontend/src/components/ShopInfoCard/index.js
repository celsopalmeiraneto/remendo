import React, {Component} from 'react';

import './index.css';

export class ShopInfoCard extends Component {
  closeComponent() {
    if (this.props.onClose) {
      this.props.onClose(true);
    }
  }

  render() {
    const shop = this.props.shop;
    return (
      <div className="shop-info-card">
        <div className="close">
          <button
            aria-label="close"
            onClick={() => this.closeComponent()}>
            X
          </button>
        </div>
        <div className="description">
          <h1>{shop.name}</h1>
          <div>Endereço: <span>{shop.address}</span></div>
          <div>Horário: <span>{shop.operationHours}</span></div>
        </div>
        <div className="photo">
          <img src={shop.pictureUrl} alt="Bicicletaria ou Borracharia" />
        </div>
      </div>
    );
  }
}
