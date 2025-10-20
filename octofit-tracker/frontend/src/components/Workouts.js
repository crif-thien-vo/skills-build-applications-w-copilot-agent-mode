import React, { useState, useEffect } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`;
  const API_ENDPOINT = `${API_BASE_URL}/workouts/`;

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        console.log('Fetching workouts from:', API_ENDPOINT);
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
        console.log('Workouts API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Processed workouts data:', workoutsData);
        
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [API_ENDPOINT]);

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading workouts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          <h4>Error loading workouts</h4>
          <p>{error}</p>
          <p><strong>API Endpoint:</strong> {API_ENDPOINT}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Workouts</h2>
      <p className="text-muted">API Endpoint: {API_ENDPOINT}</p>
      
      {workouts.length === 0 ? (
        <div className="alert alert-info">
          <p>No workouts found.</p>
        </div>
      ) : (
        <div className="row">
          {workouts.map((workout, index) => (
            <div key={workout.id || index} className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {workout.name || workout.title || `Workout ${index + 1}`}
                    {workout.difficulty && (
                      <span className={`badge ms-2 ${
                        workout.difficulty === 'easy' ? 'bg-success' :
                        workout.difficulty === 'medium' ? 'bg-warning' : 
                        workout.difficulty === 'hard' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {workout.difficulty}
                      </span>
                    )}
                  </h5>
                  <p className="card-text">
                    {workout.description && (
                      <><strong>Description:</strong> {workout.description}<br /></>
                    )}
                    {workout.duration && (
                      <><strong>Duration:</strong> {workout.duration} minutes<br /></>
                    )}
                    {workout.calories_estimate && (
                      <><strong>Est. Calories:</strong> {workout.calories_estimate}<br /></>
                    )}
                    {workout.workout_type && (
                      <><strong>Type:</strong> {workout.workout_type}<br /></>
                    )}
                    {workout.equipment && (
                      <><strong>Equipment:</strong> {workout.equipment}<br /></>
                    )}
                    {workout.target_muscle_groups && (
                      <><strong>Target Muscles:</strong> {workout.target_muscle_groups}<br /></>
                    )}
                    {workout.created_date && (
                      <><strong>Created:</strong> {new Date(workout.created_date).toLocaleDateString()}<br /></>
                    )}
                    {workout.created_by && (
                      <><strong>Created by:</strong> {workout.created_by.username || workout.created_by}<br /></>
                    )}
                  </p>
                  
                  {workout.exercises && workout.exercises.length > 0 && (
                    <div className="mt-2">
                      <h6>Exercises:</h6>
                      <ul className="list-group list-group-flush">
                        {workout.exercises.slice(0, 3).map((exercise, idx) => (
                          <li key={idx} className="list-group-item px-0 py-1">
                            <small>
                              <strong>{exercise.name || exercise}</strong>
                              {exercise.sets && exercise.reps && (
                                <span className="text-muted"> - {exercise.sets}x{exercise.reps}</span>
                              )}
                              {exercise.duration && (
                                <span className="text-muted"> - {exercise.duration}s</span>
                              )}
                            </small>
                          </li>
                        ))}
                        {workout.exercises.length > 3 && (
                          <li className="list-group-item px-0 py-1 text-muted">
                            <small>...and {workout.exercises.length - 3} more</small>
                          </li>
                        )}
                      </ul>
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
          Total workouts: {workouts.length}
        </small>
      </div>
    </div>
  );
};

export default Workouts;