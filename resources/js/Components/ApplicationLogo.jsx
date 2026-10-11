export default function ApplicationLogo(props) {
    return (
        <img 
            {...props} 
            src="/logo.png" 
            alt="Kirei Shop Logo" 
            style={{ objectFit: 'contain' }} 
        />
    );
}