import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPoll, votePoll } from '../api/client';
import type { Poll } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];


export const PollDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  const fetchPoll = async () => {
    if (!id) return;
    try {
      const data = await getPoll(id);
      setPoll(data);
    } catch (error) {
      console.error('Failed to fetch poll', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const handleVote = async (optionId: string) => {
    if (!id || voting) return;
    setVoting(true);
    try {
      await votePoll(id, { optionId });
      await fetchPoll(); // Refresh data to show new vote
    } catch (error) {
      console.error('Failed to vote', error);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        alert('You have already voted on this poll.');
      } else {
        alert('Failed to submit vote');
      }
    } finally {
      setVoting(false);
    }
  };

  if (loading) return <Container className="my-5 text-center">Loading...</Container>;
  if (!poll) return <Container className="my-5 text-center">Poll not found</Container>;

  const chartData = poll.options.map((opt) => ({
    name: opt.text,
    value: opt.vote_count,
  }));

  const totalVotes = poll.options.reduce((acc, curr) => acc + curr.vote_count, 0);

  return (
    <Container className="my-5">
      <Link to="/" className="btn btn-outline-secondary mb-4">&larr; Back to Polls</Link>
      
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="display-6 text-center mb-4">{poll.title}</Card.Title>
              <Card.Text className="text-center text-muted mb-4">{poll.description}</Card.Text>

              <Row className="align-items-center">
                <Col md={6} className="mb-4 mb-md-0">
                  <h5 className="text-center mb-3">Current Results ({totalVotes} votes)</h5>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ percent }: { percent?: number }) => percent ? `${(percent * 100).toFixed(0)}%` : ''}
                        >
                          {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Col>

                <Col md={6}>
                  <h5 className="text-center mb-3">Cast Your Vote</h5>
                  <ListGroup variant="flush">
                    {poll.options.map((opt) => (
                      <ListGroup.Item key={opt.id} className="d-flex justify-content-between align-items-center p-3">
                        <span>{opt.text}</span>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleVote(opt.id)}
                          disabled={voting}
                        >
                          Vote
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
              <div className="text-center text-muted mt-4 small">
                Note: Vote counts are updated regularly to prevent fraudulent activity.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};




