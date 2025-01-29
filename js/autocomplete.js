class Autocomplete {
    constructor(input, destinations) {
        this.input = input;
        this.destinations = destinations;
        this.autocompleteList = null;
        this.selectedIndex = -1;
        
        this.init();
    }
    
    init() {
        // Create autocomplete container
        this.autocompleteList = document.createElement('ul');
        this.autocompleteList.className = 'autocomplete-list';
        this.input.parentNode.appendChild(this.autocompleteList);
        
        // Add input event listeners
        this.input.addEventListener('input', () => this.onInput());
        this.input.addEventListener('focus', () => this.onInput());
        this.input.addEventListener('keydown', (e) => this.onKeyDown(e));
        
        // Close list when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== this.input) {
                this.closeList();
            }
        });
    }
    
    onInput() {
        const value = this.input.value.toLowerCase();
        this.closeList();
        
        if (!value) return;
        
        const matches = this.destinations.filter(dest => 
            dest.name.toLowerCase().includes(value) || 
            dest.country.toLowerCase().includes(value)
        );
        
        this.showMatches(matches);
    }
    
    showMatches(matches) {
        if (matches.length === 0) return;
        
        this.autocompleteList.innerHTML = '';
        matches.forEach((dest, index) => {
            const li = document.createElement('li');
            li.className = 'autocomplete-item';
            
            // Highlight matching text
            const regex = new RegExp(this.input.value, 'gi');
            const highlightedText = dest.name.replace(
                regex, 
                match => `<strong>${match}</strong>`
            );
            
            li.innerHTML = `
                <div class="destination-name">${highlightedText}</div>
                <div class="destination-region">${dest.region}</div>
            `;
            
            li.addEventListener('click', () => {
                this.input.value = dest.name;
                this.closeList();
                this.input.dispatchEvent(new Event('change'));
            });
            
            li.addEventListener('mouseenter', () => {
                this.selectedIndex = index;
                this.updateActiveItem();
            });
            
            this.autocompleteList.appendChild(li);
        });
        
        this.autocompleteList.style.display = 'block';
        this.selectedIndex = -1;
    }
    
    onKeyDown(e) {
        const items = this.autocompleteList.getElementsByTagName('li');
        if (!items.length) return;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                this.updateActiveItem();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.updateActiveItem();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0) {
                    items[this.selectedIndex].click();
                }
                break;
                
            case 'Escape':
                this.closeList();
                break;
        }
    }
    
    updateActiveItem() {
        const items = this.autocompleteList.getElementsByTagName('li');
        Array.from(items).forEach((item, index) => {
            item.classList.toggle('active', index === this.selectedIndex);
        });
        
        // Scroll active item into view
        if (this.selectedIndex >= 0) {
            items[this.selectedIndex].scrollIntoView({
                block: 'nearest'
            });
        }
    }
    
    closeList() {
        this.autocompleteList.style.display = 'none';
        this.selectedIndex = -1;
    }
}