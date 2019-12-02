import React from "react";

import AV from "leancloud-storage/live-query";

import "./style.css";

export default class CriteriaPage extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      event: AV.Object.createWithoutData("Event", match.params.id),
      name: "",
      category: "Design",
      max: ""
    };
    this.fetchEvent = this.fetchEvent.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleMaxChange = this.handleMaxChange.bind(this);
    this.addCriterion = this.addCriterion.bind(this);
    this.deleteCriterion = this.deleteCriterion.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!AV.User.current()) {
      history.push("/");
    } else {
      this.fetchEvent();
    }
  }

  fetchEvent() {
    const { event } = this.state;
    event
      .fetch()
      .then(event => {
        this.setState({ event });
      })
      .catch(error => {
        alert(error);
      });
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleCategoryChange(e) {
    this.setState({ category: e.target.value });
  }

  handleMaxChange(e) {
    this.setState({ max: e.target.value });
  }

  addCriterion(e) {
    const { event, name, category, max } = this.state;
    let existing = false;
    event.get("criteria").forEach(criterion => {
      if (name === criterion.name) {
        existing = true;
      }
    });
    if (existing) {
      alert("The criterion already exists.");
    } else {
      event
        .set("criteria", [
          ...event.get("criteria"),
          { name, category, max: parseInt(max) }
        ])
        .save()
        .then(event => {
          this.setState({ event, name: "", max: "" });
        })
        .catch(error => {
          alert(error);
        });
    }
    e.preventDefault();
  }

  deleteCriterion(index) {
    const { event } = this.state;
    if (
      window.confirm(
        `Are you sure to delete ${event.get("criteria")[index].name}?`
      )
    ) {
      event
        .set("criteria", [
          ...event.get("criteria").slice(0, index),
          ...event.get("criteria").slice(index + 1)
        ])
        .save()
        .then(event => {
          this.setState({ event });
        })
        .catch(error => {
          alert(error);
        });
    }
  }

  render() {
    const { event, name, category, max } = this.state;
    return (
      <div id="page">
        <div className="columns">
          <div className="column">
            <div className="card">
              <section className="fields">
                <h1>Add Criterion</h1>
                <form onSubmit={this.addCriterion}>
                  <div className="field field--half">
                    <label>
                      <span>Name</span>
                      <input
                        type="text"
                        value={name}
                        onChange={this.handleNameChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="field field--half">
                    <label>
                      <span>Category</span>
                      <select
                        value={category}
                        onChange={this.handleCategoryChange}
                        required
                      >
                        {["Design", "Functionality", "Theme"].map(category => (
                          <option value={category} key={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="field field--half">
                    <label>
                      <span>Max Score</span>
                      <input
                        type="number"
                        value={max}
                        min="1"
                        step="1"
                        onChange={this.handleMaxChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="field">
                    <button type="submit" className="primary">
                      Add
                    </button>
                  </div>
                </form>
              </section>
            </div>
            <div className="card">
              <section className="fields">
                <h1>Existing Criteria</h1>
                <div className="field">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Max Score</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(event.get("criteria") || []).map((criterion, index) => (
                        <tr key={index}>
                          <td>{criterion.name}</td>
                          <td>{criterion.category}</td>
                          <td>{criterion.max}</td>
                          <td>
                            <button
                              onClick={() => {
                                this.deleteCriterion(index);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
