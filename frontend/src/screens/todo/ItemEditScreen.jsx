import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useGetItemDetailsQuery,
  useUpdateItemMutation,
} from "../../slices/itemApiSlice";

const ItemEditScreen = () => {
  const { id: itemId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const {
    data: item,
    isLoading,
    refetch,
    error,
  } = useGetItemDetailsQuery(itemId);

  const [updateItem, { isLoading: loadingUpdate }] = useUpdateItemMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
      setStatus(item.status);
    }
  }, [item]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateItem({
        itemId,
        title,
        description,
        status,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success("Item updated");
      refetch();
      navigate("/todo/itemlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/todo/itemlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h2>Edit Todo Item</h2>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="title" className="my-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
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

            <Button
              type="submit"
              variant="primary"
              style={{ marginTop: "1rem" }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ItemEditScreen;
