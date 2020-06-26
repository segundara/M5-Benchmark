import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
    Image,
    Navbar,
    Nav,
    Button,
    Modal,
    Form,
    Accordion,
    Card,
    Badge
} from 'react-bootstrap'
import { Link } from 'react-router-dom'

class Details extends Component {

    state = {
        product: [],
        addReview: false,
        newReview: {
            elementId: this.props.match.params.id,
            comment: "",
            rate: null
        },
        reviews: []
    }

    handleChange = (e) => {
        const newReview = this.state.newReview
        newReview[e.currentTarget.id] = e.currentTarget.value

        this.setState({
            newReview
        });
    }

    fetchReviews = async () => {
        const resp = await fetch("http://127.0.0.1:3001/products/" + this.props.match.params.id + "/reviews")
        if (resp.ok) {
            const reviews = await resp.json()
            this.setState({
                reviews
            });
        }
    }

    addReview = async (e) => {
        e.preventDefault()
        const resp = await fetch("http://127.0.0.1:3001/reviews", {
            method: "POST",
            body: JSON.stringify(this.state.newReview),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (resp.ok) {
            this.fetchReviews()
            this.setState({
                addReview: false,
                newReview: {
                    elementId: this.props.match.params.id,
                    comment: "",
                    rate: null
                },
            });
        }
    }

    fetchProduct = async () => {
        const resp = await fetch("http://127.0.0.1:3001/products/" + this.props.match.params.id)

        if (resp.ok) {
            const product = await resp.json()
            this.setState({
                product
            });
        }
    }

    componentDidMount() {
        this.fetchProduct()
        this.fetchReviews()
    }


    render() {
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home">Oiii SHOP</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link onClick={() => this.props.history.push("/")}> Home</Nav.Link>
                            <Link className="nav-link" to={"/backoffice"}>BackOffice</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Container>
                    <Row>
                        {this.state.product.map(product =>
                            <>
                                <Col md={6} className="mt-5">
                                    <Image src={product.imageUrl} style={{ height: "70vh" }} />
                                </Col>
                                <Col md={6} className="mt-5 text-center">
                                    <div>
                                        <h3>{product.name}</h3>
                                        <h5 className="mt-5">Description</h5>
                                        <p>{product.description}</p>
                                        <h5>Brand</h5>
                                        <p>{product.brand}</p>
                                        <h5>Price</h5>
                                        <p>{product.price} $</p>
                                    </div>
                                    <div>
                                        <Button onClick={() => this.setState({ addReview: true })}>Add review</Button>
                                    </div>
                                    <div className="d-flex justify-content-center mt-4">
                                        {this.state.reviews.length > 0 ?
                                            <Accordion style={{ width: "70%" }}>
                                                <Card>
                                                    <Card.Header>
                                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                            This product has other reviews!
                                                </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey="1">
                                                        <>
                                                            {this.state.reviews.map(review =>
                                                                <Card.Body><Badge variant="info">{review.rate}</Badge> : {review.comment}</Card.Body>
                                                            )}
                                                        </>
                                                    </Accordion.Collapse>
                                                </Card>
                                            </Accordion>
                                            :
                                            null
                                        }
                                    </div>
                                </Col>
                            </>
                        )}
                    </Row>
                    <Modal show={this.state.addReview} onHide={() => this.setState({
                        addReview: false,
                        newReview: {
                            elementId: this.props.match.params.id,
                            comment: "",
                            rate: null
                        }
                    })}>
                        <Modal.Body>
                            <Form onSubmit={this.addReview} >
                                <Row className="d-flex justify-content-center">
                                    <Col md={8}>
                                        <Form.Group controlId="comment">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                value={this.state.newReview.comment}
                                                onChange={this.handleChange}
                                                type="text"
                                                placeholder="Your comment for the product" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="d-flex justify-content-center">
                                    <Col md={8}>
                                        <Form.Group controlId="rate">
                                            <Form.Label>Rate the product</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={this.state.newReview.rate}
                                                onChange={this.handleChange}
                                                placeholder="Rate between 1-5" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-center">
                                    <Button variant="primary" type="submit">
                                        Add review
                                </Button>

                                </div>

                            </Form>
                        </Modal.Body>
                    </Modal>
                </Container>
            </div>
        );
    }
}

export default Details;