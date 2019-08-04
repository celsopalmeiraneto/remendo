import React, {useState, useEffect} from 'react';
import styles from './index.module.css';

import closeIcon from '../../assets/close.svg';

export function SearchResults(props) {
  const [isOpen, setIsOpen] = useState(true);

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
            <li key={it.id} className={styles.searchResults}>
              {it.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
