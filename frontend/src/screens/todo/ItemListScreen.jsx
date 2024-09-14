import { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";
import { Table, Button, Row, Col, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useGetItemsQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
} from "../../slices/itemApiSlice";
import { toast } from "react-toastify";

const ItemListScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const { data, isLoading, error, refetch } = useGetItemsQuery();

  const [deleteItem, { isLoading: loadingDelete }] = useDeleteItemMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteItem(id);
        refetch();
        toast.success("Item deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createItem, { isLoading: loadingCreate }] = useCreateItemMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createItem({
        title,
        description,
        status,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success("Item created");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>New Todo Item</h2>

        <Form onSubmit={submitHandler}>
          <Form.Group className="my-2" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              required
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Completed">Completed</option>
              <option value="Incomplete">Incomplete</option>
            </Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" disabled={loadingCreate}>
            Create
          </Button>
          {loadingCreate && <Loader />}
        </Form>
      </Col>

      <Col md={9}>
        <Row className="align-items-center">
          <Col>
            <h2>Todo Items</h2>
          </Col>
        </Row>
        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data.message}</Message>
        ) : (
          <>
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.items
                  .filter((item) => item.user === userInfo._id)
                  .map((item) => (
                    <tr
                      key={item._id}
                      style={{
                        textDecoration:
                          item.status === "Completed" ? "line-through" : "none",
                        color: item.status === "Completed" ? "gray" : "inherit",
                      }}
                    >
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>{item.status}</td>
                      <td>
                        <LinkContainer to={`/todo/item/${item._id}/edit`}>
                          <Button variant="light" className="btn-sm mx-2">
                            <FaEdit />
                          </Button>
                        </LinkContainer>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => deleteHandler(item._id)}
                        >
                          <FaTrash style={{ color: "white" }} />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </>
        )}
      </Col>
    </Row>
  );
};

export default ItemListScreen;
