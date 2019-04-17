import React, { Component } from 'react';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';

class Bookings extends Component {
    state = {
        isLoading: false,
        bookings: []
    };

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookings();
    }

    fetchBookings = async () => {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
          query {
            bookings {
              _id
             createdAt
             event {
               _id
               title
               date
             }
            }
          }
        `
        };

        try {
            const res = await fetch('http://localhost:3024/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.context.token
                }
            });
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }

            const resData = await res.json();
            console.log(resData);
            const bookings = resData.data.bookings;
            this.setState({ bookings: bookings, isLoading: false });

        } catch (error) {
            console.log(error);
            this.setState({ isLoading: false });
        }

    };

    render() {
        return (
            <React.Fragment>
                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                        <ul>
                            {this.state.bookings.map(booking => (
                                <li key={booking._id}>
                                    {booking.event.title} -{' '}
                                    {new Date(booking.createdAt).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    )}
            </React.Fragment>
        );
    }
}

export default Bookings;