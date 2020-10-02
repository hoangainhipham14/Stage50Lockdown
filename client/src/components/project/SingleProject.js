import React, { Component } from "react";
import { singleProject } from "./APIProject";
import { Link, Redirect } from "react-router-dom";

class SingleProject extends Component {
  state = {
    project: "",
    redirectToHome: false,
  };

  componentDidMount = () => {
    const projectId = this.props.match.params.projectId;

    singleProject(projectId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ project: data });
      }
    });
  };

  renderProject = (project) => {
    const userId = project.postedBy ? `/user/${project.postedBy._id}` : "";
    const userName = project.postedBy ? project.postedBy.name : "Unknown";

    return (
      <div className="card-body">
        <img
          src={`/project/img/${project._id}`}
          alt={project.title}
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
          className="img-thunbnail mb-3"
        />

        <p className="card-text">{project.body}</p>
        <br />
        <p className="font-italic mark">
          Posted by <Link to={`${userId}`}>{userName} </Link>
          on {new Date(project.created).toDateString()}
        </p>
        <div className="d-inline-block">
          <Link className="btn btn-raised btn-primary btn-sm mr-5" to={`/`}>
            Back to projects...
          </Link>
        </div>
      </div>
    );
  };

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to={`/`} />;
    }
    const { project } = this.state;
    return (
      <div className="container">
        <h2 className="display-2 mt-5 mb-5">{project.title}</h2>
        {!project ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderProject(project)
        )}
      </div>
    );
  }
}

export default SingleProject;
