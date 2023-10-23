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
  const [trackData, setTrackData] = useState('');
  const [toggleReload, setToggleReload] = useState(false);
  const [queuedTracks, setQueuedTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const values = {
    isLogin, setIsLogin,
    trackData, setTrackData,
    toggleReload, setToggleReload,
    queuedTracks, setQueuedTracks,
    isPlaying, setIsPlaying
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
