import React from 'react';
import pv from 'bio-pv';
import Loading from './Loading';
import queryGeneToProtein from './queries/geneToProtein';
import queryAccessionToPdb from './queries/accessionToPdb';

class RootContainer extends React.Component {
	constructor(props) {
		super(props);
		this.visualizer = React.createRef();
		this.state = {
			structureReady: true,
			pdbIds: null,
			selectedId: 0,
			viewerMode: 'cartoon',
			error: null
		};
		this.initVisualizer = this.initVisualizer.bind(this);
	}

	componentDidMount() {
		const {
			entity: { value: geneId },
			serviceUrl,
			testing
		} = this.props;

		// if mode is `testing` don't do cals
		if (testing) return;

		this.setState({ structureReady: false });
		queryGeneToProtein(geneId, serviceUrl)
			.then(res => {
				const { proteins } = res;
				queryAccessionToPdb(proteins[0].primaryAccession)
					.then(ids => {
						this.setState({ pdbIds: ids });
						this.initVisualizer(ids);
					})
					.catch(error => {
						error =
							typeof error === 'string'
								? error
								: 'Could not download PDB file, please try again later!';
						this.setState({ error });
					});
			})
			.catch(error => this.setState({ error }));
	}

	initVisualizer(ids, selectedId) {
		if (!ids) ids = this.state.pdbIds;
		if (!selectedId) selectedId = this.state.selectedId;
		pv.io.fetchPdb(
			`https://files.rcsb.org/download/${ids[selectedId]}.pdb`,
			structure => {
				this.setState({ structureReady: true }, () => {
					// remove all current HTML from main element
					// initialise protein visualizer with default init options
					this.visualizer.current.innerHTML = '';
					const viewer = pv.Viewer(this.visualizer.current, {
						quality: 'medium',
						antialias: true,
						outline: false,
						slabMode: 'auto'
					});

					const go = viewer.renderAs(
						'structure',
						structure,
						this.state.viewerMode,
						{
							color: pv.color.ssSuccession(),
							showRelated: '1'
						}
					);

					// find camera orientation such that the molecules biggest extents are
					// aligned to the screen plane.
					const rotation = pv.viewpoint.principalAxes(go);
					viewer.setRotation(rotation);

					// adapt zoom level to contain the whole structure
					viewer.autoZoom();
				});
			}
		);
	}

	updateSelected(idIndex) {
		this.setState({ selectedId: idIndex });
		this.visualizer.current.innerHTML = '';
		this.setState({ structureReady: false });
		this.initVisualizer(null, idIndex);
	}

	changeMode(ev) {
		this.setState({ viewerMode: ev.target.value }, () => {
			this.visualizer.current.innerHTML = '';
			this.setState({ structureReady: false });
			this.initVisualizer();
		});
	}

	render() {
		const PdbIdList =
			this.state.pdbIds &&
			this.state.pdbIds.map((id, i) => (
				<div
					key={id}
					className={`option ${this.state.selectedId == i && 'selected'}`}
					onClick={() => this.updateSelected(i)}
				>
					{id}
				</div>
			));

		const ViewerModes = [
			'sline',
			'lines',
			'trace',
			'lineTrace',
			'cartoon',
			'tube',
			'spheres'
		].map(m => (
			<option key={m} value={m}>
				{m}
			</option>
		));

		if (this.state.error)
			return <div className="viz-container error">{this.state.error}</div>;

		if (!PdbIdList)
			return (
				<div className="rootContainer">
					<Loading text="Fetching associated PDB ids" />
				</div>
			);

		return (
			<div className="rootContainer">
				{this.state.structureReady ? (
					<div className="viz-container" ref={this.visualizer} />
				) : (
					<div className="viz-container">
						<Loading text="Initialising Visualizer..." />
					</div>
				)}
				<div className="select-box">
					<span className="heading">Select Viewer Mode</span>
					<select
						placeholder="Select viewer mode"
						className="viewer-select"
						onChange={this.changeMode.bind(this)}
					>
						{ViewerModes}
					</select>
					<span className="heading">Select a PDB ID</span>
					{PdbIdList}
				</div>
			</div>
		);
	}
}

export default RootContainer;
