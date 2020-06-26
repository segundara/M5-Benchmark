import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'


class Backoffice extends React.Component {
    state = {
        product: {
            name: "",
            brand: "",
            description: "",
            price: null,
            imageUrl: '',
            category: ''
        },
        photo: ''
    }
    handleChange = (event) => {
        const product = this.state.product
        product[event.currentTarget.id] = event.currentTarget.value
        this.setState({ product })
    }

    saveImg = (e) => {
        this.setState({
            photo: e.target.files[0]
        });
    }
    handleSubmit = async (e) => {

        e.preventDefault()

        const data = new FormData()
        data.append("product", this.state.photo)

        let response = await fetch("http://127.0.0.1:3001/products", {
            method: "POST",
            body: JSON.stringify(this.state.product),
            headers: {
                "Content-Type": "application/json"
            },
        })
        let productId = await response.json()

        let addPhoto = await fetch("http://127.0.0.1:3001/products/" + productId[productId.length - 1].id + "/upload", {
            method: "POST",
            body: data
        })

        setTimeout(() => {
            this.setState({
                product: {
                    name: "",
                    brand: "",
                    description: "",
                    imageUrl: '',
                    price: null,
                    category: ''
                },
                photo: ""
            });
        }, 500)


    }
    render() {
        return (
            <Container>
                <Row className="d-flex justify-content-center">
                    <Col md={7}>
                        <Form onSubmit={this.handleSubmit}>
                            <div className="form-group mt-5">
                                <label for="name">Product name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Input here the Product name"
                                    onChange={this.handleChange}
                                    value={this.state.name}
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
                                    onChange={this.handleChange}
                                    value={this.state.category}
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
                                    onChange={this.handleChange}
                                    value={this.state.description}
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
                                    onChange={this.handleChange}
                                    value={this.state.brand}
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
                                    onChange={this.handleChange}
                                    value={this.state.price}
                                    required
                                />
                            </div>
                            <div>
                                <input type="file" name="file" onChange={this.saveImg} />
                            </div>
                            <div className="form-group">
                                <Button className="btn btn-primary mt-4" onClick={() => {
                                    setTimeout(() => {
                                        alert("U created a product!")
                                        this.props.history.push("/")
                                    }, 500)
                                }} type="submit">
                                    Add Product To Store
                                </Button>
                            </div>
                        </Form>

                    </Col>
                </Row>
            </Container >
        )
    }
}
export default Backoffice