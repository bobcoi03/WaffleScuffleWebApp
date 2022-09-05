import * as React from 'react';
import { useParams } from "react-router";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class IdiotTargetPage extends React.Component {
	constructor(props){
		super(props)
		const name = this.props.params
		console.log(name)
	}
	render() {
		return (
			<p>{this.props.params.name} is an idiot</p>
		)
	}
}

export default withParams(IdiotTargetPage)