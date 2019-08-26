import {AppContext} from '../../app-context.js';
import closeIcon from '../../assets/close.svg';
import React, {useContext, useEffect, useState} from 'react';
import styles from './index.module.css';

export function SearchResults(props) {
  const [isOpen, setIsOpen] = useState(true);

  const context = useContext(AppContext);

  useEffect(() => {
    setIsOpen(true);
  }, [props.items]);

  return (
    <div style={{display: isOpen ? 'block' : 'none'}}>
      <button onClick={() => setIsOpen(false)} className={styles.close}>
        <img alt="" src={closeIcon}/>
      </button>
      <ul className={styles.searchResults}>
        {props.items.map((it) => {
          return (
            <li
              className={`${styles.searchResults}
                ${it._unclickable ? styles.unclickable : ''}`
              }
              key={it.id}
              onClick={() => {
                if (it._unclickable) return;
                context.setHighlightedShop(it);
                context.setCentroidTo(it.coords);
                context.animateShop(it.id);
              }}
            >
              {it.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
