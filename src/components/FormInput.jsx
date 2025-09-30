// Reusable form input field.
const FormInput = ({label, type = "text", value, onChange, required = false}) => {
    return (
        <div className="mb-4">
            <label className="block mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full p-2 border rounded"
            />
        </div>
    );
};

export default FormInput;
