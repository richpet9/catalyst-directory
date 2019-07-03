import React from 'react';
import Header from '../../components/Header/Header.js';
import Card from '../../components/Card/Card.js';
import Spinner from '../../components/Spinner/Spinner.js';
import './App.css';

const App = props => {
    const { people, loading, error } = props;

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

    return (
        <div id="app">
            <Header setSearchQuery={setSearchQuery} />
            {loading ? (
                <Spinner />
            ) : (
                <div className="container" id="card-container">
                    {error
                        ? error
                        : people.map(employee => {
                              return <Card key={employee.ext} person={employee} />;
                          })}
                </div>
            )}
        </div>
    );
};

export default App;
