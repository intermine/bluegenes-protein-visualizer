import React from 'react';
import pv from 'bio-pv';
import queryGeneToProtein from './queries/geneToProtein';
import queryAccessionToPdb from './queries/accessionToPdb';

class RootContainer extends React.Component {
	constructor(props) {
		super(props);
		this.visualizer = React.createRef();
	}

	componentDidMount() {
		const {
			entity: { value: geneId },
			serviceUrl
		} = this.props;

		const viewer = pv.Viewer(this.visualizer.current, {
			quality: 'medium',
			antialias: true,
			outline: false,
			slabMode: 'auto'
		});

		queryGeneToProtein(geneId, serviceUrl).then(res => {
			const { proteins } = res;
			queryAccessionToPdb(proteins[0].primaryAccession).then(ids => {
				pv.io.fetchPdb(
					`https://files.rcsb.org/download/${ids[2]}.pdb`,
					structure => {
						const go = viewer.cartoon('structure', structure, {
							color: pv.color.ssSuccession(),
							showRelated: '1'
						});

						// find camera orientation such that the molecules biggest extents are
						// aligned to the screen plane.
						const rotation = pv.viewpoint.principalAxes(go);
						viewer.setRotation(rotation);

						// adapt zoom level to contain the whole structure
						viewer.autoZoom();
					}
				);
			});
		});
	}

	render() {
		return (
			<div className="rootContainer">
				<div ref={this.visualizer} />
				<div className="selection">
					<label>Hello</label>
					<select>
						<option>Option 1</option>
						<option>Option 1</option>
						<option>Option 1</option>
					</select>
				</div>
			</div>
		);
	}
}

export default RootContainer;
