import React, { useContext, useState } from 'react';
import { Container, Image, Button } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Profile = ({ history }) => {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const { currentUser, setCurrentUser, setLoading } = useContext(AppContext);

  const handleChange = (event) => {
    setPreview(URL.createObjectURL(event.target.files[0]));
    setImage(event.target.files[0]);
  };

  const handleImage = (event) => {
    event.preventDefault();
    setLoading(true);
    const avatar = new FormData();
    avatar.append('avatar', image, image.name);
    axios
      .post('/api/users/avatar', avatar, { withCredentials: true })
      .then((response) => {
        setCurrentUser({ ...currentUser, avatar: response.data.secure_url });
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios({
        method: 'DELETE',
        url: '/api/users/me',
        withCredentials: true,
      });
      setLoading(false);
      sessionStorage.removeItem('user');
      setCurrentUser(null);
      history.push('/login');
    } catch (error) {
      console.log(error.toString());
    }
  };

  return (
    <>
      <Navigation />
      <Container className="d-flex flex-column align-items-center justify-content-center">
        <h1>Your Profile</h1>
        <div>
          <Image
            src={
              preview
                ? preview
                : currentUser?.avatar
                ? currentUser.avatar
                : 'https://files.willkennedy.dev/wyncode/wyncode.png'
            }
            alt="profilePic"
            width={250}
            height={250}
            roundedCircle
          />
        </div>
        <div className="mt-4">
          <form className="d-flex flex-column" onSubmit={handleImage}>
            <input type="file" accept="image/*" onChange={handleChange} />
            <Button className="mt-2" type="submit">
              Save Image
            </Button>
          </form>
        </div>
        <div className="mt-4">
          <p>Name: {currentUser?.name}</p>
          <p>Email: {currentUser?.email}</p>
        </div>
        <div>
          <Button variant="danger" onClick={handleDelete}>
            Delete Account
          </Button>
        </div>
      </Container>
    </>
  );
};

export default Profile;
