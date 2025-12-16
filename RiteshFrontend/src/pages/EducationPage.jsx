import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { educationAPI } from '../services/api';

const EducationPage = ({ userEmail, onBack, onSignOut, onProfileClick }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    level: '',
    search: ''
  });
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    loadResources();
  }, [filters]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await educationAPI.getResources(filters);
      setResources(response.resources || []);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceClick = async (resource) => {
    try {
      const response = await educationAPI.getResource(resource._id);
      setSelectedResource(response.resource);
      // Update progress to "In Progress" if not started
      await educationAPI.updateProgress(resource._id, {
        status: 'In Progress',
        progress: 0
      });
    } catch (error) {
      console.error('Error loading resource:', error);
    }
  };

  if (selectedResource) {
    return (
      <ResourceViewer
        resource={selectedResource}
        onBack={() => setSelectedResource(null)}
        userEmail={userEmail}
        onSignOut={onSignOut}
        onProfileClick={onProfileClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <Header userEmail={userEmail} onSignOut={onSignOut} onProfileClick={onProfileClick} onBack={onBack} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-text-primary mb-6">Educational Resources</h1>

        {/* Filters */}
        <div className="bg-card-bg p-4 rounded-lg border border-border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
            />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
            >
              <option value="">All Types</option>
              <option value="Article">Article</option>
              <option value="Video">Video</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Quiz">Quiz</option>
              <option value="Course">Course</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
            >
              <option value="">All Categories</option>
              <option value="Basics">Basics</option>
              <option value="Technical Analysis">Technical Analysis</option>
              <option value="Fundamental Analysis">Fundamental Analysis</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Psychology">Psychology</option>
              <option value="Strategies">Strategies</option>
            </select>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <p className="text-text-secondary">Loading resources...</p>
        ) : resources.length === 0 ? (
          <div className="bg-card-bg p-8 rounded-lg border border-border text-center">
            <p className="text-text-secondary">No resources found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource._id}
                onClick={() => handleResourceClick(resource)}
                className="bg-card-bg p-6 rounded-lg border border-border hover:border-primary cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                    {resource.type}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs">
                    {resource.level}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">{resource.title}</h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">{resource.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">{resource.category}</span>
                  {resource.duration && (
                    <span className="text-text-secondary">{resource.duration} min</span>
                  )}
                </div>
                {resource.rating && resource.rating.count > 0 && (
                  <div className="mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-text-secondary text-sm ml-1">
                      {resource.rating.average.toFixed(1)} ({resource.rating.count})
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ResourceViewer = ({ resource, onBack, userEmail, onSignOut, onProfileClick }) => {
  const [progress, setProgress] = useState(0);

  const handleProgressUpdate = async (newProgress) => {
    try {
      await educationAPI.updateProgress(resource._id, {
        progress: newProgress,
        status: newProgress === 100 ? 'Completed' : 'In Progress'
      });
      setProgress(newProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <Header userEmail={userEmail} onSignOut={onSignOut} onProfileClick={onProfileClick} onBack={onBack} />
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="mb-6 text-primary hover:text-primary-dark font-semibold"
        >
          ← Back to Resources
        </button>
        <div className="bg-card-bg p-8 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-primary/20 text-primary rounded">
              {resource.type}
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded">
              {resource.level}
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded">
              {resource.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-4">{resource.title}</h1>
          <p className="text-text-secondary mb-6">{resource.description}</p>
          
          {resource.type === 'Video' && resource.videoUrl && (
            <div className="mb-6">
              <iframe
                src={resource.videoUrl}
                className="w-full h-96 rounded-lg"
                allowFullScreen
              />
            </div>
          )}

          <div className="prose max-w-none text-text-primary mb-6">
            <div dangerouslySetInnerHTML={{ __html: resource.content }} />
          </div>

          {resource.type !== 'Video' && (
            <div className="mt-6">
              <label className="block text-text-secondary mb-2">Progress: {progress}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => handleProgressUpdate(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationPage;

