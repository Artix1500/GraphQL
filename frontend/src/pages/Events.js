import React, { Component } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';

import './Events.scss'
import EventList from '../components/Events/Eventlist';
import Spinner from '../components/Spinner/Spinner';

class EventsPage extends Component {
    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }
    isActive = true;

    componentDidMount() {
        this.fetchEvents();
    }

    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    };

    static contextType = AuthContext;

    startCreateEventHandler = () => {
        this.setState({ creating: true });
    }

    modalConfirmHandler = async () => {
        this.setState({ creating: false });
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if (title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0) {
            return;
        }

        const event = { title, price, date, description };
        console.log(event);


        const requestBody = {
            query: `
                    mutation {
                        createEvent(eventInput: {
                            title: "${title}"
                            description: "${description}"
                            price: ${price}
                            date: "${date}"
                        }){
                            _id
                            title
                            description
                            price
                            date
                        }
                    }
                `
        };

        const token = this.context.token;
        console.log(requestBody);

        try {
            const res = await fetch("http://localhost:3024/graphql", {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }

            const resData = await res.json();
            console.log(resData);
            //this.fetchEvents();
            this.setState(prevState => {
                const updatedEvents = [...prevState.events];
                updatedEvents.push({
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    description: resData.data.createEvent.description,
                    date: resData.data.createEvent.date,
                    price: resData.data.createEvent.price,
                    creator: {
                        _id: this.context.userId
                    }
                });
                return { events: updatedEvents };
            });

        } catch (error) {
            console.log(error);
        }
    }

    modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null });
    }

    bookEventHandler = async () => {
        if (!this.context.token) {
            this.setState({ selectedEvent: null });
            return;
        }
        const requestBody = {
            query: `
              mutation {
                bookEvent(eventId: "${this.state.selectedEvent._id}") {
                  _id
                 createdAt
                 updatedAt
                }
              }
            `
        };

        const token = this.context.token;

        try {
            const res = await fetch("http://localhost:3024/graphql", {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            const resData = await res.json();
            console.log(resData);
            this.setState({ selectedEvent: null });
        } catch (error) {
            console.log(error);
        }
    };

    fetchEvents = async () => {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                    query {
                        events {
                            _id
                            title
                            description
                            price
                            date
                            creator {
                                _id
                                email
                            }
                        }
                    }
                `
        };

        try {
            const res = await fetch("http://localhost:3024/graphql", {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }

            const resData = await res.json();
            const events = resData.data.events;
            if(this.isActive){
                this.setState({ events: events, isLoading: false });
            }

        } catch (error) {
            console.log(error);
            this.setState({ isLoading: false });
        }
    }

    showDetailHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return { selectedEvent: selectedEvent };
        });
    };

    componentWillUnmount() {
        this.isActive = false;
    }


    render() {
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating && <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={this.modalCancelHandler}
                    onConfirm={this.modalConfirmHandler}
                >
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.titleElRef}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={this.priceElRef}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={this.dateElRef}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Title</label>
                            <textarea rows="4" id="description" ref={this.descriptionElRef}></textarea>
                        </div>
                    </form>
                </Modal>}
                {this.context.token &&
                    <div className="events-control">
                        <p>Share your own Event!</p>
                        <button onClick={this.startCreateEventHandler}>Create Event</button>
                    </div>
                }

                {this.state.isLoading ? (
                    <Spinner />
                ) : (
                        <EventList
                            events={this.state.events}
                            authUserId={this.context.userId}
                            onViewDetail={this.showDetailHandler}
                        />
                    )}
                {/* <EventList
                    events={this.state.events}
                    authUserId={this.context.userId}
                    onViewDetail={this.showDetailHandler}
                /> */}


                {this.state.selectedEvent && <Backdrop />}
                {this.state.selectedEvent && (
                    <Modal
                        title={this.state.selectedEvent.title}
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.bookEventHandler}
                        confirmText={this.context.token ? 'Book' : 'Confirm'}
                    >
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>
                            ${this.state.selectedEvent.price} -{' '}
                            {new Date(this.state.selectedEvent.date).toLocaleDateString()}
                        </h2>
                        <p>{this.state.selectedEvent.description}</p>
                    </Modal>
                )}

            </React.Fragment>
        );
    }
}

export default EventsPage;