import React from 'react';

import { Card, CardHeader, CardFooter, CardBody } from 'reactstrap';

const Post = ({
  data: {
    title,
    body,
    author: { name },
    published,
  },
}) => (
  <Card style={{ margin: '30px auto', width: '400px' }}>
    <CardHeader>{title}</CardHeader>
    <CardBody>
      {body || <p style={{ opacity: 0.5 }}>No body for this post...</p>}
    </CardBody>
    <CardFooter>{`${name} - published: ${published}`}</CardFooter>
  </Card>
);

export default Post;
