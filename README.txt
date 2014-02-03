<!-- Setup Environment --> 

WEBSOLR_URL=http://localhost:8983/solr/collection1

<!-- Solr Schema fields for Product -->

   
   <field name="Name" type="text_general" indexed="true" stored="true"/>
   <field name="Make__c"  type="text_general" indexed="true" stored="true"/>
   <field name="SIM_Size__c"  type="text_general" indexed="true" stored="true"/>
   <field name="Memory_Gb__c" type="int" indexed="true" stored="true"/>
   <field name="Model__c"  type="text_general" indexed="true" stored="true"/>
   <field name="OwnerId"  type="text_general" indexed="true" stored="true"/>
   <field name="CreatedDate" type="date" indexed="true" stored="true"/>
   <field name="Type__c"  type="text_general" indexed="true" stored="true"/>
   <field name="Camera__c"  type="int" indexed="true" stored="true"/>
   <field name="Screen_Size_Inches__c"  type="int" indexed="true" stored="true"/>
   <field name="Colour__c"  type="text_general" indexed="true" stored="true"/>
   <field name="Operating_system__c"  type="text_general" indexed="true" stored="true"/>
   <field name="ThumbImageId__c"  type="text_general" indexed="false" stored="true"/>
   <field name="Available_Tariffs__c" type="text_general" indexed="true" stored="true" multiValued="true"/>
