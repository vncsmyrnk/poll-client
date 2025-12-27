import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getPolls } from '../api/client';
import { CreatePollModal } from '../components/CreatePollModal';
import type { Poll } from '../types';

export const Home = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchPolls = async (q?: string) => {
    try {
      const data = await getPolls(q);
      setPolls(data);
    } catch (error) {
      console.error('Failed to fetch polls', error);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPolls(search);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-start d-flex mb-4">
        <Col md={8}>
          <Form onSubmit={handleSearch} className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Search polls..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="secondary" type="submit">
              Search
            </Button>
            <Button variant="primary" type="button" onClick={() => setShowCreateModal(true)}>
              New
            </Button>
          </Form>
        </Col>
      </Row>

      <Row xs={1} md={2} lg={2} className="g-4 justify-content-center">
        {polls.map((poll) => (
          <Col key={poll.id}>
            <Card as={Link} to={`/polls/${poll.id}`} className="h-100 text-decoration-none text-dark" style={{ cursor: 'pointer' }}>
              <Card.Body>
                <Card.Title>{poll.title}</Card.Title>
                <Card.Text>{poll.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <CreatePollModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onPollCreated={() => fetchPolls(search)}
      />
    </Container>
  );
};

