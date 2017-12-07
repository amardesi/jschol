Sequel.migration do
  change do

    create_table(:referrers) do
      primary_key :id
      String      :domain, index: true, null: false
    end

    create_table(:locations) do
      primary_key :id
      BigDecimal  :lat, size: [7,4], null: false
      BigDecimal  :long, size: [7,4], null: false
      String      :city
      String      :country
      index [:lat, :long]
    end

    create_table(:item_events) do
      foreign_key :item_id,  :items, type: String, size: 10, fixed: true, null: false
      Date        :date,     null: false
      Integer     :time
      foreign_key :location, :locations, type: Integer
      String      :attrs,    type: 'JSON'
      index [:date, :item_id]
    end

    create_table(:item_stats) do
      foreign_key :item_id,  :items, type: String, size: 10, fixed: true, null: false
      Integer     :month,    null: false
      String      :events,   type: 'JSON'
      TrueClass   :is_dirty, null: false, default: true
      index [:month, :item_id]
    end

    create_table(:item_hier_cache) do
      foreign_key :item_id,  :items, type: String, size: 10, fixed: true, null: false
      String      :old_hier
      String      :cur_hier, null: false
    end

    create_table(:person_stats) do
      foreign_key :person_id, :people, type: String, null: false
      Integer     :month,    null: false
      String      :events,   type: 'JSON', null: false
      index [:month, :person_id]
    end

    create_table(:unit_stats) do
      foreign_key :unit_id, :units, type: String, null: false
      Integer     :month,    null: false
      String      :events,   type: 'JSON', null: false
      index [:month, :unit_id]
    end
  end
end
