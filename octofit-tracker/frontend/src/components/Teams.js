import React, { useState, useEffect } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`;
  const API_ENDPOINT = `${API_BASE_URL}/teams/`;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        console.log('Fetching teams from:', API_ENDPOINT);
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
        console.log('Teams API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Processed teams data:', teamsData);
        
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [API_ENDPOINT]);

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          <h4>Error loading teams</h4>
          <p>{error}</p>
          <p><strong>API Endpoint:</strong> {API_ENDPOINT}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Teams</h2>
      <p className="text-muted">API Endpoint: {API_ENDPOINT}</p>
      
      {teams.length === 0 ? (
        <div className="alert alert-info">
          <p>No teams found.</p>
        </div>
      ) : (
        <div className="row">
          {teams.map((team, index) => (
            <div key={team.id || index} className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {team.name || 'Team Name'}
                    {team.is_active !== undefined && (
                      <span className={`badge ms-2 ${team.is_active ? 'bg-success' : 'bg-secondary'}`}>
                        {team.is_active ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </h5>
                  <p className="card-text">
                    {team.description && (
                      <><strong>Description:</strong> {team.description}<br /></>
                    )}
                    {team.members_count !== undefined && (
                      <><strong>Members:</strong> {team.members_count}<br /></>
                    )}
                    {team.total_points !== undefined && (
                      <><strong>Total Points:</strong> {team.total_points}<br /></>
                    )}
                    {team.created_date && (
                      <><strong>Created:</strong> {new Date(team.created_date).toLocaleDateString()}<br /></>
                    )}
                    {team.captain && (
                      <><strong>Captain:</strong> {team.captain.username || team.captain}<br /></>
                    )}
                  </p>
                  {team.members && team.members.length > 0 && (
                    <div className="mt-2">
                      <h6>Members:</h6>
                      <div className="d-flex flex-wrap gap-1">
                        {team.members.map((member, idx) => (
                          <span key={idx} className="badge bg-secondary">
                            {member.username || member.name || member}
                          </span>
                        ))}
                      </div>
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
          Total teams: {teams.length}
        </small>
      </div>
    </div>
  );
};

export default Teams;