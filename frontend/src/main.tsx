import React, { Fragment, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
// import { registerSW } from 'virtual:pwa-register'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Friends from './pages/Friends'
import 'react-datepicker/dist/react-datepicker.css'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { IRootState, store } from './redux/store';
import PomoTimer from './pages/PomoTimer'
import Login from './pages/Login'
import Register from './pages/Register'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { signIn, signOut } from './redux/slices/authSlice'

// const updateSW = registerSW({
//   onNeedRefresh() { },
//   onOfflineReady() { },
// })

function AppRoutes() {

  const auth = getAuth();
  const user = useSelector((state: IRootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  React.useEffect(() => {
    let unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(signIn(await user.getIdToken()));
      } else {
        dispatch(signOut());
      }
    });

    return unsubscribe()
  }, [auth, dispatch])

  useEffect(() => {
    if (user) {
      // console.log("User we got: ", user)
      navigate('/')
    }
  }, [user])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      <Route path="/" element={!user ? <Navigate to={'/login'} /> : <App />} >
        <Route index element={<Home />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/timer" element={<PomoTimer />} />
      </Route>
    </Routes>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
