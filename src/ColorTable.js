import { Component } from 'react';

class ColorTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			color_table: [
				['#FFFFFF', 'hydrogen (H)'],
				['#000000', 'carbon (C)'],
				['#2233FF', 'nitrogen (N)'],
				['#FF2200', 'oxygen (O)'],
				['#1FF01F', 'fluorine (F), chlorine (Cl)'],
				['#992200', 'bromine (Br)'],
				['#6600BB', 'iodine (I)'],
				['#00FFFF', 'noble gases (He, Ne, Ar, Xe, Kr)'],
				['#FF9900', 'phosphorus (P)'],
				['#FFE522', 'sulfur (S)'],
				['#FFAA77', 'boron (B), most transition metals'],
				['#7700FF', 'alkali metals (Li, Na, K, Rb, Cs, Fr)'],
				['#007700', 'alkaline earth metals (Be, Mg, Ca, Sr, Ba, Ra)'],
				['#999999', 'titanium (Ti)'],
				['#DD7700', 'iron (Fe)'],
				['#DD77FF', 'other elements']
			]
		};
		this.setColor = this.setColor.bind(this);
	}
	setColor(colorValue) {
		let background = {
			height: '10px',
			width: '10px',
			margin: '0px 0px 0px 0px',
			background: colorValue,
			border: 'thin solid grey'
		};
		return background;
	}
	render() {
		return (
			<div>
				<table>
					<tbody>
						{this.state.color_table.map(element => {
							return (
								<tr>
									<td>
										<div style={this.setColor(element[0])}></div>
									</td>

									<td>{element[1]}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}

export default ColorTable;
