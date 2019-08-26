import closeIcon from '../../assets/close.svg';
import React, {Component} from 'react';

import styles from './index.module.css';

export class ShopInfoCard extends Component {
  closeComponent() {
    if (this.props.onClose) {
      this.props.onClose(true);
    }
  }

  render() {
    const shop = this.props.shop;
    return (
      <div className={styles.shopInfoCard}>
        <div className={styles.headerLine}>
          <h1>{shop.name}</h1>
          <div className={styles.close}>
            <button
              aria-label="close"
              onClick={() => this.closeComponent()}>
              <img alt="" src={closeIcon} />
            </button>
          </div>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.description}>
            <div>Endereço: <span>{shop.address}</span></div>
            <div>Horário: <span>{shop.operationHours}</span></div>
          </div>
          <div className={styles.photo}>
            <img src={shop.pictureUrl} alt="Bicicletaria ou Borracharia" />
          </div>
        </div>
      </div>
    );
  }
}
