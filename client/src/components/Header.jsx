const Header = ({ title, onAddProject, onAddTask }) => {
  return (
    <div style={styles.header}>
      <div style={styles.left}>
        <h1 style={styles.title}>{title}</h1>
      </div>

      <div style={styles.right}>
        <button onClick={onAddTask} style={styles.addButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Assign Task
        </button>
        
        <button onClick={onAddProject} style={styles.addButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Project
        </button>
        
        <div style={styles.profile}>
          <img 
            src={`https://ui-avatars.com/api/?name=Admin+User&background=1f2937&color=fff&size=32`} 
            alt="Profile"
            style={styles.avatar}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    marginBottom: '20px'
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#1f2937',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#374151'
    }
  },
  profile: {
    cursor: 'pointer'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%'
  }
};

export default Header;