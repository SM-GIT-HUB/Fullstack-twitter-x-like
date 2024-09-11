/* eslint-disable react/prop-types */

function LoadingSpinner({ size = "md" })
{
	const sizeClass = `loading-${size}`;

	return <span className={`loading loading-spinner ${sizeClass}`} />;
}


export default LoadingSpinner