import React from 'react';
import queryGeneToProtein from './queries/geneToProtein';
import accessionToPdb from './queries/accessionToPdb';

class RootContainer extends React.Component {
	componentDidMount() {
		const {
			entity: { value: geneId },
			serviceUrl
		} = this.props;

		// get all proteins with their accession ids associated with the gene
		queryGeneToProtein(geneId, serviceUrl).then(res => {
			const { proteins } = res;
			accessionToPdb(proteins[0].primaryAccession).then(() => {});
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
