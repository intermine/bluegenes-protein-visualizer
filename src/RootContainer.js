import React from 'react';
import queryGeneToProtein from './queries/geneToProtein';

class RootContainer extends React.Component {
	componentDidMount() {
		const {
			entity: { value: geneId },
			serviceUrl
		} = this.props;

		// get all proteins with their accession ids associated with the gene
		queryGeneToProtein(geneId, serviceUrl).then(() => {
			// const { proteins } = res;
			// console.log(proteins.map(p => p.primaryAccession));
		});

		// get pdb file for each protein
	}

	render() {
		return (
			<div className="rootContainer">
				<h1>Your Data Viz Here</h1>
			</div>
		);
	}
}

export default RootContainer;
