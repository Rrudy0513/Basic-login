import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { AppContextProvider } from './context/AppContext';
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	return (
		<AppContextProvider>
			<BrowserRouter>
				<Switch>
					<Route exact path='/' component={Home} />
					<Route exact path='/login' component={Login} />
					<Route exact path='/signup' component={SignUp} />
					<PrivateRoute exact path='/' component={Home} />
				</Switch>
			</BrowserRouter>
		</AppContextProvider>
	);
}

export default App;
