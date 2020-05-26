import React, { useEffect, useCallback, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap'

import {
  POSTS_QUERY,
  CREATE_POST_MUTATION,
  POSTS_SUBSCRIPTION
} from '../../graphql'
import Post from '../../components/Post/Post'
import classes from './App.module.css'

const App = () => {
  const [formTitle, setFormTitle] = useState('')
  const [formBody, setFormBody] = useState('')

  const { loading, error, data, subscribeToMore } = useQuery(POSTS_QUERY)
  const [addPost] = useMutation(CREATE_POST_MUTATION)

  useEffect(() => {
    subscribeToMore({
      document: POSTS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newPost = subscriptionData.data.post.data

        return {
          ...prev,
          posts: [newPost, ...prev.posts]
        }
      }
    })
  }, [subscribeToMore])

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault()

      if (!formTitle || !formBody) return

      addPost({
        variables: {
          title: formTitle,
          body: formBody,
          published: true,
          authorId: 2
        }
      })

      setFormTitle('')
      setFormBody('')
    },
    [addPost, formTitle, formBody]
  )

  return (
    <Container>
      <Row>
        <Col>
          <h1 className={classes.title}>Modern GraphQL Tutorial</h1>
        </Col>
      </Row>
      <Row>
        <Col xs="6" className={classes.form}>
          <Form onSubmit={handleFormSubmit}>
            <FormGroup row>
              <Label for="title" sm={2}>
                Title
              </Label>
              <Col sm={10}>
                <Input
                  name="title"
                  value={formTitle}
                  id="title"
                  placeholder="Post title..."
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Label for="body">Body</Label>
              <Input
                type="textarea"
                name="body"
                value={formBody}
                id="body"
                placeholder="Post body..."
                onChange={(e) => setFormBody(e.target.value)}
              />
            </FormGroup>
            <Button
              type="submit"
              color="primary"
              disabled={formTitle === '' || formBody === ''}
            >
              Post!
            </Button>
          </Form>
        </Col>
        <Col xs="6">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error :(((</p>
          ) : (
            data.posts.map((post, id) => <Post data={post} key={id} />)
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default App
