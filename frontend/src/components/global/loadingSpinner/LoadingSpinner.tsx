import './LoadingSpinner.scss';

interface ProgressSpinner {
  overLay: boolean;
}


export const LoadingSpinner: React.FC<ProgressSpinner> = ({ overLay }) => {

  return (
    <div style={{ height: "100%", width: '100%', position: 'absolute', top: 0, left: 0, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="spinnerDiv">
        const hello
        <div className="background"></div>
        <div className="foreground"></div>

      </div>
    </div>
  )
}