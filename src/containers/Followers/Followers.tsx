/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Helmet } from 'react-helmet';

import Section from '../../components/Section/Section';

import FollowersList from './components/FollowersList';
import FollowersListChanges from './components/FollowersListChanges';

import { useBaseStore } from '../../stores';
import { FollowersDiff } from '../../types';

import s from './Followers.module.css';

const Followers = () => {
  const {
    main: { username, token },
    followers: {
      followers,
      loading,
      saving,
      getUserFollowersList,
      storeFollowersList,
      cleanFollowersList,
      getFollowersListDiff,
    },
  } = useBaseStore();

  const [targetUsername, setTargetUsername] = useState<string>(username);
  const [followersDiff, setFollowersDiff] = useState<FollowersDiff | null>(null);

  useEffect(() => {
    setTargetUsername(username);
  }, [username]);

  useEffect(() => {
    cleanFollowersList();
  }, [targetUsername]);

  useEffect(() => {
    if (!saving) {
      (async () => setFollowersDiff(await getFollowersListDiff(targetUsername)))();
    }
  }, [followers, targetUsername, saving]);

  useEffect(() => {
    gtag('event', 'impression', { event_category: 'followers' });
  }, []);

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="GitHub Subscriber is the best open-source application that helps you to manage your followers list! Check what has changed since your last visit! Who follows you, who has unfollowed since the last check. Get the difference with the previous snapshot."
        />
        <title>GitHub Subscriber - Watch your GitHub audience grow</title>
      </Helmet>
      <Section title="whose followers to load">
        <label htmlFor="user[target]">User whose followers will be loaded:</label>
        <input
          id="user[target]"
          type="text"
          value={targetUsername}
          placeholder="ex.: rpolonsky"
          onChange={e => setTargetUsername(e.target.value.trim())}
          onKeyUp={e => {
            if (e.keyCode === 13) {
              getUserFollowersList(targetUsername, username, token);
              gtag('event', 'load-followers', {
                event_category: 'followers',
                event_label: targetUsername,
              });
            }
          }}
          onFocus={() => gtag('event', 'user-input-focus', { event_category: 'followers' })}
        ></input>
        <div className={s.row}>
          <button
            onClick={() => {
              getUserFollowersList(targetUsername, username, token);
              gtag('event', 'load-followers', {
                event_category: 'followers',
                event_label: targetUsername,
              });
            }}
            disabled={loading || !targetUsername.length}
          >
            Load followers
          </button>
          <button
            disabled={!followers.length || loading || !targetUsername.length}
            onClick={() => {
              storeFollowersList(targetUsername);
              gtag('event', 'save-followers', {
                event_category: 'followers',
                event_label: targetUsername,
              });
            }}
          >
            {saving ? 'Saving followers...' : 'Save followers snapshot'}
          </button>
        </div>
      </Section>

      {!!followers.length && !loading && !saving && (
        <FollowersListChanges followersDiff={followersDiff} targetUsername={targetUsername} />
      )}

      <FollowersList followers={followers} loading={loading} />
    </>
  );
};

export default observer(Followers);
