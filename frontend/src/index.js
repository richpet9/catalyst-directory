import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { PeopleAPI, tryToGetError } from './functions';
import AppPage from './pages/App/App.js';
import EditPage from './pages/Edit/Edit.js';
import Header from './components/Header/Header.js';

//Non destructive array searching
let EmployeeList;

const RoutingContainer = props => {
    const [people, setPeople] = useState([]); //Container for our employee array
    const [loading, setLoading] = useState(true); //Whether or not the application should display loading
    const [error, setError] = useState(null); //Whether or not to display error, and the message

    const status = { people: people, loading: loading, error: error }; //This variable just cleans up our components props

    //Handle posting data to the server
    const postData = data => {
        PeopleAPI.postData(data)
            .then(res => {
                if (!res.ok) {
                    console.error('ERROR POSTING DATA:INDEX.JS');
                    tryToGetError(res);
                } else return res.json();
            })
            //We don't need to call setPeople() here because this function is only
            // ever called from the EditPage, which handles updating the frontend by itself.
            //If/When AppPage is remounted, useEffect (below) will be called, which then calls setPeople()
            .then(data => {
                EmployeeList = data;
                console.log('Data post successful, server res: ', data);
            });
    };

    //Handle searching stuff
    const setSearchQuery = value => {
        if (!loading) {
            setLoading(true);

            const filteredList = EmployeeList.filter(employee => {
                // This filter function checks if the search query matches the name, location, or
                // cell number and returns `true` if there is a match, which tells the above method
                // to add this employee to `filteredList`.
                if (employee.fullName.toLowerCase().includes(value.toLowerCase())) {
                    return true;
                }
                if (employee.loc.toLowerCase().includes(value.toLowerCase())) {
                    return true;
                }
                if (
                    employee.cell //Prettier, my make-things-look-nice plugin, made this look not nice
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase())
                ) {
                    return true;
                }
            });

            setError(filteredList.length <= 0 ? 'No results found for: ' + value : null);
            setPeople(filteredList);

            setLoading(false);
        }
    };

    useEffect(() => {
        PeopleAPI.getPeople()
            .then(res => {
                if (!res.ok) {
                    console.error('ERROR FETCHING DATA:INDEX.JS');
                    setError(
                        'Error occured when connecting to the database file, please refresh. Contact system administrator if this problem persists.'
                    );
                    setLoading(false);
                    tryToGetError(res);
                } else return res.json();
            })
            .then(data => {
                EmployeeList = data;
                setPeople(EmployeeList);
                setLoading(false);
            });
    }, []);

    return (
        <Router>
            <Switch>
                <Route path="/" exact render={props => <AppPage {...props} status={status} setSearchQuery={setSearchQuery} />} />
                <Route
                    path="/edit"
                    render={props => (
                        <EditPage {...props} status={status} setPeople={setPeople} postData={postData} setSearchQuery={setSearchQuery} />
                    )}
                />
                <Route component={NoRoute} />
            </Switch>
        </Router>
    );
};

const NoRoute = () => {
    return (
        <h1>
            <Header />
            404: That page was not found!
        </h1>
    );
};

ReactDOM.render(<RoutingContainer />, document.getElementById('root'));
