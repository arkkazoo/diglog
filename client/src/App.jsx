import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { MyProvider } from './MyContext';

import Home from './pages/Home'
import MyDigs from './pages/MyDigs'
import MyPlaylists from './pages/MyPlaylists'
import PlaylistEdit from './pages/PlaylistEdit'
import Search from './pages/Search'
import MyPage from './pages/MyPage'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import Header from './components/Header'
import MusicPlayer from './components/MusicPlayer'


function App() {
  const [isLogin, setIsLogin] = useState(false);

  // playingTrack: 再生中の曲の情報(artist, title, url, domain, tags)
  // queuedTracks: 再生待ちの曲の情報
  const [playingTrack, setPlayingTrack] = useState('');
  const [queuedTracks, setQueuedTracks] = useState([]);

  const [isLoopEnabled, setIsLoopEnabled] = useState(false);
  const [loopTargetTracks, setLoopTargetTracks] = useState([]);

  const [toggleReload, setToggleReload] = useState(false);
  const [playerHasTrack, setPlayerHasTrack] = useState(false);

  const [searchToggle, setSearchToggle] = useState(false);

  const values = {
    isLogin, setIsLogin,
    playingTrack, setPlayingTrack,
    queuedTracks, setQueuedTracks,
    isLoopEnabled, setIsLoopEnabled,
    loopTargetTracks, setLoopTargetTracks,
    toggleReload, setToggleReload,
    playerHasTrack, setPlayerHasTrack,
    searchToggle, setSearchToggle
  };

  return (
    <MyProvider value={values}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/mydigs" element={<MyDigs />} />
          <Route path="/myplaylists" element={<MyPlaylists />} />
          <Route path="/myplaylists/edit/:id" element={<PlaylistEdit />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search:params" element={<Search />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        <MusicPlayer />
      </BrowserRouter>
    </MyProvider>
  );
}

export default App
