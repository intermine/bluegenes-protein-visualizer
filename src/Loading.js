import React from 'react';

function Loading({ text }) {
	return (
		<div className="loading-container">
			<span className="loading-text">{text}</span>
			<div className="loading">
				<div>
					<span />
					<span />
					<span />
					<span />
				</div>
			</div>
		</div>
	);
}

export default Loading;
