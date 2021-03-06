import React from 'react';
import { observer } from 'mobx-react';
import { useLocation, useHistory } from 'react-router-dom';
import cx from 'classnames';

import { ROOT, UNSUBSCRIBE, FOLLOWERS, SUBSCRIBE } from '../../utils/routes';
import { useBaseStore } from '../../stores';

import Section from '../../components/Section/Section';
import MenuButton from '../../components/MenuButton/MenuButton';

import s from './Menu.module.css';

const Menu = () => {
  const {
    main: { setMenuState, setUsername, setToken, isMenuOpen, username, token },
    main: { remainingRateLimit },
  } = useBaseStore();

  const { pathname: path } = useLocation();
  const { push } = useHistory();

  return (
    <div className={cx(s.menu, { [s.open]: isMenuOpen })}>
      <div className={s.heading} onClick={() => setMenuState(false)}>
        <MenuButton open className={s.closeButton} />
        CLOSE
      </div>
      {!!remainingRateLimit && (
        <Section title="rate limits">
          <div>
            available requests: {remainingRateLimit.remaining} / {remainingRateLimit.limit}
          </div>
          <div>reset time: {remainingRateLimit.resetDate.toLocaleString()}</div>
        </Section>
      )}
      <Section title="your credentials">
        <label htmlFor="user[login]">Your github nickname:</label>
        <input
          id="user[login]"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value.trim())}
          onFocus={() => {
            gtag('event', 'user-input-focus', { event_category: 'menu' });
          }}
        ></input>
        <label htmlFor="token">
          Your github access token <br /> (it will not be stored):
        </label>
        <input
          id="token"
          type="text"
          value={token}
          onChange={e => setToken(e.target.value)}
          onFocus={() => {
            gtag('event', 'token-input-focus', { event_category: 'menu' });
          }}
        ></input>
      </Section>
      <Section
        onClick={() => {
          push(SUBSCRIBE);
          setMenuState(false);
        }}
        className={cx(s.button, { [s.active]: [SUBSCRIBE, ROOT].includes(path) })}
      >
        Subscribe
      </Section>
      <Section
        onClick={() => {
          push(UNSUBSCRIBE);
          setMenuState(false);
        }}
        className={cx(s.button, { [s.active]: path === UNSUBSCRIBE })}
      >
        Unsubscribe
      </Section>
      <Section
        onClick={() => {
          push(FOLLOWERS);
          setMenuState(false);
        }}
        className={cx(s.button, { [s.active]: path === FOLLOWERS })}
      >
        Followers List
      </Section>
    </div>
  );
};

export default observer(Menu);
