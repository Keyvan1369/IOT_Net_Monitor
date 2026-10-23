
function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <div className="col-6 col-xl-3">
      <div className="stat-card h-100">
        <div className={`stat-icon ${color}`}>
          <i className={`bi ${icon}`}></i>
        </div>

        <p className="stat-title">{title}</p>
        <h3>{value}</h3>
        <small>{subtitle}</small>
      </div>
    </div>
  );
}

export default StatCard;
