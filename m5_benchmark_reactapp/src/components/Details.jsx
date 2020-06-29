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
        editModal: false,
        newReview: {
            elementId: this.props.match.params.id,
            comment: "",
            rate: null
        },
        editProductInfo: {
            name: "",
            brand: "",
            description: "",
            imageUrl: '',
            price: null,
            category: ''
        },
        reviews: [],
        photo: ''
    }


    editInfo = (event) => {
        const editProductInfo = this.state.editProductInfo

        if (event.currentTarget.id === "price") {
            editProductInfo[event.currentTarget.id] = parseInt(event.currentTarget.value)
        } else {
            editProductInfo[event.currentTarget.id] = event.currentTarget.value
        }
        this.setState({ editProductInfo })
    }

    handleChange = (e) => {
        const newReview = this.state.newReview
        if (e.currentTarget.id === "rate") {
            newReview[e.currentTarget.id] = parseInt(e.currentTarget.value)
        } else {
            newReview[e.currentTarget.id] = e.currentTarget.value
        }

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

    editProduct = async () => {
        const resp = await fetch("http://127.0.0.1:3001/products/" + this.props.match.params.id)

        if (resp.ok) {
            const product = await resp.json()
            this.setState({
                editProductInfo: {
                    name: product[0].name,
                    brand: product[0].brand,
                    description: product[0].description,
                    imageUrl: product[0].imageUrl,
                    price: parseInt(product[0].price),
                    category: product[0].category
                },
                editModal: true
            });
        }
    }

    deleteProduct = async () => {
        const resp = await fetch("http://127.0.0.1:3001/products/" + this.props.match.params.id, {
            method: "DELETE"
        })
        if (resp.ok) {
            this.props.history.push("/")
        }
    }

    componentDidMount() {
        this.fetchProduct()
        this.fetchReviews()
    }

    saveImg = (e) => {
        this.setState({
            photo: e.target.files[0]
        });
    }

    deleteReview = async (id) => {
        const resp = await fetch("http://127.0.0.1:3001/reviews/" + id, {
            method: "DELETE"
        })

        this.fetchProduct()

    }

    addProduct = async (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append("product", this.state.photo)

        const resp = await fetch("http://127.0.0.1:3002/products/" + this.props.match.params.id, {
            method: "PUT",
            body: JSON.stringify(this.state.editProductInfo),
            headers: {
                "Content-Type": "application/json"
            }
        })

        let addPhoto = await fetch("http://127.0.0.1:3002/products/" + this.props.match.params.id + "/upload", {
            method: "POST",
            body: data
        })

        if (resp.ok) {
            this.setState({
                editModal: false
            });
            this.fetchProduct()
        }

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
                                        <p>{product.price}<Badge variant="info">$</Badge></p>
                                    </div>
                                    <div className="mb-3">
                                        <Button onClick={() => this.setState({ addReview: true })}>Add review</Button>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Button
                                            variant="danger"
                                            className="mr-3"
                                            onClick={() => this.deleteProduct()}
                                        >Delete</Button>
                                        <Button
                                            variant="warning"
                                            onClick={() => this.editProduct()}
                                        >Edit</Button>
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
                                                                <Card.Body>
                                                                    <Badge variant="info">{review.rate}</Badge> : {review.comment}
                                                                    <Button
                                                                        className="ml-3"
                                                                        variant="danger"
                                                                        onClick={() => this.deleteReview(review._id)}
                                                                    >Delete</Button>
                                                                    <Button
                                                                        className="ml-3"
                                                                        variant="warning"
                                                                    >Edit</Button>
                                                                </Card.Body>
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
                    <Modal
                        show={this.state.editModal}
                        onHide={() => this.setState({
                            editModal: false, editProductInfo: {
                                name: "",
                                brand: "",
                                description: "",
                                imageUrl: '',
                                price: null,
                                category: ''
                            }
                        })}>
                        <Modal.Body>
                            <Form onSubmit={this.addProduct}>
                                <div className="form-group mt-5">
                                    <label for="name">Product name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Input here the Product name"
                                        onChange={this.editInfo}
                                        value={this.state.editProductInfo.name}
                                        required
                                    />
                                </div>
                                <div className="form-group ">
                                    <label for="category">Product Category</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="category"
                                        placeholder="Input here the category name"
                                        onChange={this.editInfo}
                                        value={this.state.editProductInfo.category}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="description">Product description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="description"
                                        placeholder="Input here the Product description"
                                        onChange={this.editInfo}
                                        value={this.state.editProductInfo.description}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="price">Product brand</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="brand"
                                        placeholder="Input here the Product brand"
                                        onChange={this.editInfo}
                                        value={this.state.editProductInfo.brand}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="price">Product price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="price"
                                        placeholder="Input here the Product price"
                                        onChange={this.editInfo}
                                        value={this.state.editProductInfo.price}
                                        required
                                    />
                                </div>
                                <div>
                                    <input type="file" name="file" onChange={this.saveImg} />
                                </div>
                                <div className="form-group">
                                    <Button className="btn btn-primary mt-4" type="submit">
                                        Add New Info
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