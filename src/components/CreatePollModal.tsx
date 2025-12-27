import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { createPoll } from '../api/client';
import axios from 'axios';

interface CreatePollModalProps {
  show: boolean;
  onHide: () => void;
  onPollCreated: () => void;
}

export const CreatePollModal = ({ show, onHide, onPollCreated }: CreatePollModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    const validOptions = options.map(o => o.trim()).filter(o => o.length > 0);
    if (validOptions.length < 2) {
      setError('At least two valid options are required.');
      return;
    }

    setLoading(true);
    try {
      await createPoll({
        title,
        description,
        options: validOptions,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      
      onPollCreated();
      onHide();
    } catch (err) {
      console.error('Failed to create poll', err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('You must be logged in to create a poll.');
      } else {
        setError('Failed to create poll. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Poll</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form.Group className="mb-3">
            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., What is your favorite programming language?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Label>Options (Max 5) <span className="text-danger">*</span></Form.Label>
          {options.map((option, index) => (
            <Form.Group key={index} className="mb-2 d-flex gap-2">
              <Form.Control
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              {options.length > 2 && (
                <Button 
                  variant="outline-danger" 
                  onClick={() => removeOption(index)}
                  title="Remove option"
                >
                  &times;
                </Button>
              )}
            </Form.Group>
          ))}
          
          <div className="mt-3">
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={addOption}
              disabled={options.length >= 5}
            >
              + Add Option
            </Button>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Poll'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
