import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Form, Container } from 'react-bootstrap';
import { fetchData, addData, updateData, deleteData, setFormData, setErrors, startEditing, stopEditing } from '../features/formSlice';

function App() {
  const dispatch = useDispatch();
  const { data, formData, errors, isEditing, editId } = useSelector((state) => state.form);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ ...formData, [name]: value }));
    if(errors[name]){
    dispatch(setErrors({ ...errors, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age)) {
      newErrors.age = 'Age must be a number';
    } else if (formData.age < 18 || formData.age > 120) {
      newErrors.age = 'Age must be between 18 to 120';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      dispatch(setErrors(newErrors));
    } else {
      if (isEditing) {
        dispatch(updateData({ id: editId, formData }));
        dispatch(stopEditing());
      } else {
        dispatch(addData(formData));
        dispatch(setFormData({ name: '', email: '', age: '' }));
      }
    }
  };

  const handleEdit = (id) => {
    dispatch(startEditing(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteData(id));
  };

  return (
    <Container>
      <h1 className="my-4">Form</h1>
      <Form onSubmit={handleSubmit} className='w-50' style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px' }}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
        </Form.Group>
        <Form.Group controlId="formAge">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && <div style={{ color: 'red' }}>{errors.age}</div>}
        </Form.Group>
        <Button variant="primary" type="submit" className='mt-3'>
          {isEditing ? 'Update' : 'Submit'}
        </Button>
      </Form>
      <h2 className="my-4">Data Table</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.age}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(item.id)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
