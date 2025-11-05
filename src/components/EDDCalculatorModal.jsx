import {useState} from "react";
import {X, Calendar} from "lucide-react";

const EDDCalculatorModal = ({onClose}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dateType, setDateType] = useState("Last Menstrual Period");
    const [inputDate, setInputDate] = useState("");
    const [result, setResult] = useState(null);

    const calculateEDD = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!inputDate) {
            alert("Zabi Rana.");
            return;
        }

        const selectedDate = new Date(inputDate);
        let edd, earliest, latest;

        if (dateType === "Last Menstrual Period") {
            // LMP: Add 280 days (40 weeks)
            edd = new Date(selectedDate);
            edd.setDate(selectedDate.getDate() + 280);
            // Earliest: 38 weeks (266 days)
            earliest = new Date(selectedDate);
            earliest.setDate(selectedDate.getDate() + 266);
            // Latest: 42 weeks (294 days)
            latest = new Date(selectedDate);
            latest.setDate(selectedDate.getDate() + 294);
        } else if (dateType === "Conception Date") {
            // Conception: Add 266 days (38 weeks)
            edd = new Date(selectedDate);
            edd.setDate(selectedDate.getDate() + 266);
            // Earliest: 36 weeks (252 days)
            earliest = new Date(selectedDate);
            earliest.setDate(selectedDate.getDate() + 252);
            // Latest: 40 weeks (280 days)
            latest = new Date(selectedDate);
            latest.setDate(selectedDate.getDate() + 280);
        } else {
            // Known Due Date: Use input date
            edd = new Date(selectedDate);
            // Earliest: 14 days before
            earliest = new Date(selectedDate);
            earliest.setDate(selectedDate.getDate() - 14);
            // Latest: 14 days after
            latest = new Date(selectedDate);
            latest.setDate(selectedDate.getDate() + 14);
        }

        setResult({
            edd: edd.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"}),
            earliest: earliest.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"}),
            latest: latest.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"}),
        });
    };

    // Close handler that also notifies parent if provided
    const handleClose = () => {
        setIsOpen(false);
        if (typeof onClose === "function") onClose();
    };

    return (
        <>
            {/* Floating calendar button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-20 bg-blue-800 text-white p-4 rounded-full shadow-lg hover:bg-[--primary]/90 z-50"
                aria-label="Open EDD Calculator"
            >
                <Calendar size={24} />
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 max-h-[80vh] bg-white shadow-xl rounded-lg flex flex-col z-50 border border-gray-200 overflow-auto">
                    <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
                        <h3 className="font-bold text-lg">
                            Expected Delivery Date Calculator (Kalkulaton Kirga Ranar Da za'a Haihu)
                        </h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-800"
                            aria-label="Close EDD Calculator"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        <div className="mb-0 rounded-lg border border-[--accent] bg-[--accent]/30 p-3 dark:border-yellow-800/50 dark:bg-[--accent]/10">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        aria-hidden="true"
                                        className="h-5 w-5 text-yellow-500 dark:text-yellow-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 15a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                                        Disclaimer (Ikrari)
                                    </h3>
                                    <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
                                        Ranar da wannan Kalkulator yake badawa kintace ne ne kawai ka Je gurin Likita ko
                                        Kwararren Ma'aikacin lafiya domin samun ingataccen bayani da kuma shawarwari.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={calculateEDD} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="date-type"
                                    className="block text-sm font-medium text-[--text] dark:text-gray-300"
                                >
                                    Select Date Type
                                </label>
                                <select
                                    id="date-type"
                                    name="date-type"
                                    value={dateType}
                                    onChange={(e) => setDateType(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 py-2 pl-3 pr-10 text-sm text-[--text] focus:border-[--primary] focus:outline-none focus:ring-[--primary] dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                                >
                                    <option>Ranar Da Aka yi Jinin Al'ada na Karshe</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium text-[--text] dark:text-gray-300"
                                >
                                    Kwanan Wata
                                </label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={inputDate}
                                    onChange={(e) => setInputDate(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 py-2 px-3 text-sm text-[--text] focus:border-[--primary] focus:outline-none focus:ring-[--primary] dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[--primary]/80 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 sm:w-auto"
                                >
                                    Lissafa
                                </button>
                            </div>
                        </form>

                        {result && (
                            <div className="mt-2">
                                <h3 className="text-md font-medium text-[--text] dark:text-white text-center">
                                    Kwanan watan Ranar Da zaki Haihu Shine:
                                </h3>
                                <p className="mt-2 text-2xl font-extrabold text-[--primary] text-center">
                                    {result.edd}
                                </p>

                                <div className="mt-4 rounded-lg bg-white p-4 shadow-sm dark:bg-[--background]/30">
                                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Zaki iya Haihuwa Daga Ranar
                                            </p>
                                            <p className="mt-1 text-lg font-bold text-[--text] dark:text-white">
                                                {result.earliest}
                                            </p>
                                        </div>
                                        <div className="h-10 w-px bg-gray-200 dark:bg-gray-800/50 hidden sm:block" />
                                        <div className="w-full h-px bg-gray-200 dark:bg-gray-800/50 sm:hidden" />
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Har zuwa Ranar
                                            </p>
                                            <p className="mt-1 text-lg font-bold text-[--text] dark:text-white">
                                                {result.latest}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-800/50">
                                        <div className="flex items-start gap-3">
                                            <div className="size-6 shrink-0 text-[--primary]">
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-[--text] dark:text-white">
                                                    Bayanin Ma'aikatan Lafiya (Obstetrician's Note)
                                                </h4>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    Ranar da mace zata haihuwa kintace ne kawai. Amma Juna biyu yana iya
                                                    yin sati 38 har zuwa 42. Saboda haka zaki iya Haihuwar danki sati 2
                                                    kafin ko bayan Ranar da Kalkuleton ya Lissafa.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default EDDCalculatorModal;
