import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Loader2 } from 'lucide-react';

interface Option {
    value: string | number;
    label: string;
    icon?: React.ReactNode;
}

interface SearchableSelectProps {
    label?: string;
    value: string | number;
    onChange: (value: string | number) => void;
    onSearch: (query: string) => void;
    options: Option[];
    isLoading?: boolean;
    placeholder?: string;
}

export function SearchableSelect({
    label,
    value,
    onChange,
    onSearch,
    options,
    isLoading,
    placeholder = "Search..."
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Encontra a opção atualmente selecionada
    const selectedOption = options.find(opt => String(opt.value) === String(value));

    // Fecha o dropdown se clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setQuery(''); // Limpa a busca visual ao fechar
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
        setIsOpen(true);
    };

    const handleSelect = (optionValue: string | number) => {
        onChange(optionValue);
        setQuery('');
        setIsOpen(false);
    };

    const handleWrapperClick = () => {
        if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    };

    return (
        <div className="space-y-1.5 relative" ref={wrapperRef}>
            {label && (
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                    {label}
                </label>
            )}

            <div
                className={`relative flex items-center w-full px-4 py-2.5 bg-white border rounded-xl text-sm transition-all cursor-text ${isOpen ? 'ring-2 ring-indigo-500/10 border-indigo-500' : 'border-zinc-200 hover:border-zinc-300'}`}
                onClick={handleWrapperClick}
            >
                <div className="flex items-center gap-2 flex-1 overflow-hidden">
                    {selectedOption && !isOpen && selectedOption.icon && (
                        <span className="flex-shrink-0">{selectedOption.icon}</span>
                    )}
                    {!selectedOption && !isOpen && (
                        <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    )}

                    <input
                        ref={inputRef}
                        type="text"
                        value={isOpen ? query : (selectedOption ? selectedOption.label : '')}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className="w-full bg-transparent outline-none placeholder:text-zinc-400 truncate cursor-text"
                        readOnly={!isOpen}
                    />
                </div>

                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    {isLoading && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />}
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg max-h-60 overflow-y-auto py-1">
                    {options.length === 0 && !isLoading ? (
                        <div className="px-4 py-3 text-sm text-zinc-500 text-center">
                            No results found
                        </div>
                    ) : (
                        options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(option.value);
                                }}
                                className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-zinc-50 ${String(value) === String(option.value) ? 'bg-indigo-50/50 text-indigo-700 font-medium' : 'text-zinc-700'}`}
                            >
                                {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                                <span className="truncate">{option.label}</span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
