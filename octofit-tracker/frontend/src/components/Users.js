import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`;
  const API_ENDPOINT = `${API_BASE_URL}/users/`;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users from:', API_ENDPOINT);
        setLoading(true);
        
        const response = await fetch(API_ENDPOINT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Users API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const usersData = data.results || data;
        console.log('Processed users data:', usersData);
        
        setUsers(Array.isArray(usersData) ? usersData : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [API_ENDPOINT]);

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          <h4>Error loading users</h4>
          <p>{error}</p>
          <p><strong>API Endpoint:</strong> {API_ENDPOINT}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Users</h2>
      <p className="text-muted">API Endpoint: {API_ENDPOINT}</p>
      
      {users.length === 0 ? (
        <div className="alert alert-info">
          <p>No users found.</p>
        </div>
      ) : (
        <div className="row">
          {users.map((user, index) => (
            <div key={user.id || index} className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {user.username || user.name || `User ${index + 1}`}
                    {user.is_active !== undefined && (
                      <span className={`badge ms-2 ${user.is_active ? 'bg-success' : 'bg-secondary'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </h5>
                  <p className="card-text">
                    {user.email && (
                      <><strong>Email:</strong> {user.email}<br /></>
                    )}
                    {user.first_name && user.last_name && (
                      <><strong>Name:</strong> {user.first_name} {user.last_name}<br /></>
                    )}
                    {user.team && (
                      <><strong>Team:</strong> {user.team.name || user.team}<br /></>
                    )}
                    {user.total_points !== undefined && (
                      <><strong>Total Points:</strong> {user.total_points}<br /></>
                    )}
                    {user.activities_count !== undefined && (
                      <><strong>Activities:</strong> {user.activities_count}<br /></>
                    )}
                    {user.date_joined && (
                      <><strong>Joined:</strong> {new Date(user.date_joined).toLocaleDateString()}<br /></>
                    )}
                    {user.last_login && (
                      <><strong>Last Login:</strong> {new Date(user.last_login).toLocaleDateString()}<br /></>
                    )}
                  </p>
                  {user.bio && (
                    <div className="mt-2">
                      <small className="text-muted">{user.bio}</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4">
        <small className="text-muted">
          Total users: {users.length}
        </small>
      </div>
    </div>
  );
};

export default Users;