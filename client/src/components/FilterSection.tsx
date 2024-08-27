interface Filters{
    // name:string,
    brands:string[],
    colors:string[],
    sizes:string[],
   

}


interface FilterSectionProps {
    filters: Filters;
    onBrandsChange: (brands: string[]) => void;
    onColorsChange: (colors: string[]) => void;
    onSizesChange: (sizes: string[]) => void;
  }
  
  const FilterSection: React.FC<FilterSectionProps> = ({ filters, onBrandsChange, onColorsChange, onSizesChange }) => {
    const handleBrandsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const updatedBrands = e.target.checked
        ? [...filters.brands, value]
        : filters.brands.filter((brand) => brand !== value);
      onBrandsChange(updatedBrands);
    };

    
  
    const handleColorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const updatedColors = e.target.checked
        ? [...filters.colors, value]
        : filters.colors.filter((color) => color !== value);
      onColorsChange(updatedColors);
    };
  
    const handleSizesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const updatedSizes = e.target.checked
        ? [...filters.sizes, value]
        : filters.sizes.filter((size) => size !== value);
      onSizesChange(updatedSizes);
    };
  
    return (
      <div className="p-4 bg-gray-100">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
  
        <div className="mb-4">
          <h3 className="text-lg font-medium">Brands</h3>
          <div>
            <label>
              <input
                type="checkbox"
                value="Adidas"
                checked={filters.brands.includes('Adidas')}
                onChange={handleBrandsChange}
              />
              Adidas
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="Leecooper"
                checked={filters.brands.includes('Leecooper')}
                onChange={handleBrandsChange}
              />
             Leecooper
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="Raymond"
                checked={filters.brands.includes('Raymond')}
                onChange={handleBrandsChange}
              />
              Raymond
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="Levis"
                checked={filters.brands.includes('Levis')}
                onChange={handleBrandsChange}
              />
              Levis
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="Rangriti"
                checked={filters.brands.includes('Rangriti')}
                onChange={handleBrandsChange}
              />
              Rangriti
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="AllenSolly"
                checked={filters.brands.includes('AllenSolly')}
                onChange={handleBrandsChange}
              />
             AllenSolly
            </label>
          </div>

          
        </div>
  



        <div className="mb-4">
          <h3 className="text-lg font-medium">Colors</h3>
          <div>
            <label>
              <input
                type="checkbox"
                value="Red"
                checked={filters.colors.includes('Red')}
                onChange={handleColorsChange}
              />
              Red
            </label>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                value="Blue"
                checked={filters.colors.includes('Blue')}
                onChange={handleColorsChange}
              />
              Blue
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="Green"
                checked={filters.colors.includes('Green')}
                onChange={handleColorsChange}
              />
              Green
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="Black"
                checked={filters.colors.includes('Black')}
                onChange={handleColorsChange}
              />
              Black
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="Orange"
                checked={filters.colors.includes('Orange')}
                onChange={handleColorsChange}
              />
              Orange
            </label>
          </div>
        </div>
  
        <div className="mb-4">
          <h3 className="text-lg font-medium">Sizes</h3>
          <div>
            <label>
              <input
                type="checkbox"
                value="S"
                checked={filters.sizes.includes('S')}
                onChange={handleSizesChange}
              />
              Small
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="M"
                checked={filters.sizes.includes('M')}
                onChange={handleSizesChange}
              />
              Medium
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="L"
                checked={filters.sizes.includes('L')}
                onChange={handleSizesChange}
              />
              Large
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="XL"
                checked={filters.sizes.includes('XL')}
                onChange={handleSizesChange}
              />
             X-Large
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value="XXL"
                checked={filters.sizes.includes('XXL')}
                onChange={handleSizesChange}
              />
              XX-Large
            </label>
          </div>
        </div>
      </div>
    );
  };
  
  export default FilterSection;
  