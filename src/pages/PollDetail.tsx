import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ListGroup, Modal } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPoll, votePoll, getPollCounts, getMyVote } from '../api/client';
import type { Poll, PollCounts } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];


export const PollDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [pollCounts, setPollCounts] = useState<PollCounts | null>(null);
  const [userVoteOptionId, setUserVoteOptionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchPollData = async () => {
    if (!id) return;

    const pollPromise = getPoll(id).then(setPoll);

    const countsPromise = getPollCounts(id)
      .then(setPollCounts)
      .catch((error) => {
        if (axios.isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 401)) {
          setPollCounts(null);
        } else {
          console.error('Failed to fetch poll counts', error);
        }
      });

    const votePromise = getMyVote(id)
      .then((myVote) => setUserVoteOptionId(myVote.option_id))
      .catch((error) => {
        setUserVoteOptionId(null);
        console.debug('Failed to fetch my vote', error);
      });

    try {
      await Promise.all([pollPromise, countsPromise, votePromise]);
    } catch (error) {
      console.error('Failed to fetch poll data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPollData();
  }, [id]);

  const handleVote = async (optionId: string) => {
    if (!id || voting) return;
    setVoting(true);
    try {
      await votePoll(id, { optionId });
      await fetchPollData();
    } catch (error) {
      console.error('Failed to vote', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert('You have already voted on this poll.');
        } else if (error.response?.status === 401) {
          setShowLoginModal(true);
        } else {
          alert('Failed to submit vote');
        }
      } else {
        alert('Failed to submit vote');
      }
    } finally {
      setVoting(false);
    }
  };

  const handleLoginRedirect = () => {
    localStorage.setItem('loginRedirect', location.pathname);
    navigate('/login');
  };

  if (loading) return <Container className="my-5 text-center">Loading...</Container>;
  if (!poll) return <Container className="my-5 text-center">Poll not found</Container>;

  const showChart = pollCounts !== null;

  const chartData = showChart ? poll.options.map((opt) => ({
    name: opt.text,
    value: pollCounts![opt.id]?.VoteCount || 0,
  })) : [];

  const totalVotes = showChart ? Object.values(pollCounts!).reduce((acc, curr) => acc + curr.VoteCount, 0) : 0;

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
                  <h5 className="text-center mb-3">
                    {showChart ? `Current Results (${totalVotes} votes)` : 'Results Hidden'}
                  </h5>
                  {showChart ? (
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
                  ) : (
                    <div className="text-center text-muted py-5 d-flex align-items-center justify-content-center" style={{ height: 300 }}>
                      <p>Vote to see results</p>
                    </div>
                  )}
                </Col>

                <Col md={6}>
                  <h5 className="text-center mb-3">Cast Your Vote</h5>
                  <ListGroup variant="flush">
                    {poll.options.map((opt) => {
                      const isVoted = userVoteOptionId === opt.id;
                      return (
                        <ListGroup.Item key={opt.id} className="d-flex justify-content-between align-items-center p-3">
                          <span>{opt.text}</span>
                          <Button
                            variant={isVoted ? "success" : "outline-primary"}
                            size="sm"
                            onClick={() => handleVote(opt.id)}
                            disabled={voting || isVoted}
                          >
                            {isVoted ? 'Voted' : 'Vote'}
                          </Button>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Col>
              </Row>
              <div className="text-center text-muted mt-4 small">
                Note: Vote counts are not updated instantly for correctness and to prevent fraudulent activity.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You must be logged in to vote. Please log in to continue.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLoginRedirect}>
            Log In
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};






