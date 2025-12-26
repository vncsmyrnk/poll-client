import { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

export const Login = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col lg={6}>
          <Card className="shadow">
            <Card.Body className="text-center p-5">
              <h2 className="mb-4">Welcome Back</h2>
              <div id="g_id_onload"
                data-client_id="961823302476-ftv4t3461ie5j2ep76o3nbab680gn8an.apps.googleusercontent.com"
                data-ux_mode="redirect"
                data-login_uri="https://poll-api.vncsmyrnk.dev/oauth/callback">
              </div>
              <div className="g_id_signin" data-type="standard"></div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
